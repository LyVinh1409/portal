package server

import (
    "net/http"
    "os"

    "github.com/example/project/backend/internal/auth"
    "github.com/example/project/backend/internal/banner"
    "github.com/example/project/backend/internal/category"
    "github.com/example/project/backend/internal/media"
    "github.com/example/project/backend/internal/models"
    "github.com/example/project/backend/internal/news"
    "github.com/example/project/backend/internal/handlers"
    "github.com/example/project/backend/internal/roles"
    "github.com/example/project/backend/internal/storage"
    "github.com/example/project/backend/internal/user"
    "github.com/gin-gonic/gin"
    swaggerFiles "github.com/swaggo/files"
    ginSwagger "github.com/swaggo/gin-swagger"
    "golang.org/x/crypto/bcrypt"
    "gorm.io/gorm"
)

type Config struct {
    DBConfig dbConfig
    RedisAddr string
    MinioEndpoint string
    MinioAccess string
    MinioSecret string
    MinioBucket string
    JwtSecret string
    Port string
}

type dbConfig struct {
    Host string
    Port string
    User string
    Password string
    DBName string
}

type Server struct{
    engine *gin.Engine
    db *gorm.DB
    cfg Config
    authService *auth.Service
}

func LoadConfig() Config {
    return Config{
        DBConfig: dbConfig{
            Host:     os.Getenv("POSTGRES_HOST"),
            Port:     os.Getenv("POSTGRES_PORT"),
            User:     os.Getenv("POSTGRES_USER"),
            Password: os.Getenv("POSTGRES_PASSWORD"),
            DBName:   os.Getenv("POSTGRES_DB"),
        },
        RedisAddr:     os.Getenv("REDIS_ADDR"),
        MinioEndpoint: os.Getenv("MINIO_ENDPOINT"),
        MinioAccess:   os.Getenv("MINIO_ACCESS_KEY"),
        MinioSecret:   os.Getenv("MINIO_SECRET_KEY"),
        MinioBucket:   os.Getenv("MINIO_BUCKET"),
        JwtSecret:     os.Getenv("JWT_SECRET"),
        Port:          os.Getenv("API_PORT"),
    }
}

func New(db *gorm.DB, cfg Config) *Server {
    r := gin.Default()
    s := &Server{engine: r, db: db, cfg: cfg}

    db.AutoMigrate(&models.User{})
    db.AutoMigrate(&models.Role{}, &models.UserRole{}, &models.Permission{}, &models.RolePermission{})
    db.AutoMigrate(&models.Category{})
    db.AutoMigrate(&models.Tag{}, &models.News{}, &models.Comment{}, &models.Upload{})
    db.AutoMigrate(&models.Banner{})
    db.AutoMigrate(&models.Media{})
    db.AutoMigrate(&models.NewsletterSubscriber{})
    db.AutoMigrate(&models.ViewLog{})
    db.AutoMigrate(&models.Poll{}, &models.PollOption{}, &models.PollVote{})
    db.AutoMigrate(&models.AuditLog{})

    // init auth store and service
    store := auth.NewRedisStore(cfg.RedisAddr)
    s.authService = auth.NewService(db, store, cfg.JwtSecret)

    // init category service and handlers
    catSvc := category.NewService(db)
    catHandler := handlers.NewCategoryHandler(catSvc)

    // init storage client
    minioClient, _ := storage.New(cfg.MinioEndpoint, cfg.MinioAccess, cfg.MinioSecret, cfg.MinioEndpoint == "https://minio", cfg.MinioBucket)

    // init news service and handlers
    newsSvc := news.NewService(db, minioClient)
    newsHandler := handlers.NewNewsHandler(newsSvc)

    // init upload handler
    uploadHandler := handlers.NewUploadHandler(minioClient, db)

    // init banner service and handlers
    bannerSvc := banner.NewService(db, minioClient)
    bannerHandler := handlers.NewBannerHandler(bannerSvc)

    // init media service and handlers
    mediaSvc := media.NewService(db, minioClient)
    mediaHandler := handlers.NewMediaHandler(mediaSvc, minioClient, db)

    // swagger docs route
    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

    api := r.Group("/api")
    api.GET("/health", func(c *gin.Context){ c.JSON(200, gin.H{"status":"ok"}) })

    authGroup := api.Group("/auth")
    authGroup.POST("/register", s.register)
    authGroup.POST("/login", s.login)
    authGroup.POST("/refresh", s.refresh)
    authGroup.POST("/logout", s.logout)

    protected := api.Group("")
    protected.Use(auth.JWTMiddleware(s.cfg.JwtSecret))
    protected.GET("/me", s.me)

    // user routes
    userSvc := user.NewService(db)
    userHandler := handlers.NewUserHandler(userSvc)
    // protect user endpoints
    protectedGroup := api.Group("")
    protectedGroup.Use(auth.JWTMiddleware(s.cfg.JwtSecret))
    userHandler.RegisterRoutes(protectedGroup)

    // category routes
    catGroup := api.Group("")
    catGroup.Use(auth.JWTMiddleware(s.cfg.JwtSecret))
    catHandler.RegisterRoutes(catGroup)

    // news routes
    newsGroup := api.Group("")
    newsGroup.Use(auth.JWTMiddleware(s.cfg.JwtSecret))
    newsHandler.RegisterRoutes(newsGroup)

    // upload route
    uploadGroup := api.Group("")
    uploadGroup.Use(auth.JWTMiddleware(s.cfg.JwtSecret))
    uploadHandler.RegisterRoutes(uploadGroup)

    // banner routes
    bannerGroup := api.Group("")
    bannerGroup.Use(auth.JWTMiddleware(s.cfg.JwtSecret))
    bannerHandler.RegisterRoutes(bannerGroup)

    // media routes
    mediaGroup := api.Group("")
    mediaGroup.Use(auth.JWTMiddleware(s.cfg.JwtSecret))
    mediaHandler.RegisterRoutes(mediaGroup)

    // dashboard routes
    dashboardHandler := handlers.NewDashboardHandler(db)
    dashGroup := api.Group("")
    dashGroup.Use(auth.JWTMiddleware(s.cfg.JwtSecret))
    dashboardHandler.RegisterRoutes(dashGroup)

    // roles & permissions
    rolesSvc := roles.NewService(db)
    // ensure default roles
    _ = rolesSvc.EnsureDefaultRoles()
    rolesHandler := handlers.NewRolesHandler(rolesSvc)
    roleGroup := api.Group("")
    roleGroup.Use(auth.JWTMiddleware(s.cfg.JwtSecret))
    rolesHandler.RegisterRoutes(roleGroup)

    return s
}

func (s *Server) Run(addr string) error {
    return s.engine.Run(addr)
}

func (s *Server) register(c *gin.Context) {
    // @Summary Register a new user
    // @Description Create new user account with email and password
    // @Tags Auth
    // @Accept json
    // @Produce json
    // @Param input body object{email=string,password=string} true "Register request"
    // @Success 201 {object} object{id=integer,email=string}
    // @Failure 400 {object} object{error=string}
    // @Router /auth/register [post]
    var body struct{ Email, Password string }
    if err := c.ShouldBindJSON(&body); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid"}); return }
    hashed, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"internal"}); return }
    user := models.User{Email: body.Email, PasswordHash: string(hashed)}
    if err := s.db.Create(&user).Error; err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"create"}); return }
    c.JSON(http.StatusCreated, gin.H{"id": user.ID, "email": user.Email})
}

func (s *Server) login(c *gin.Context) {
    // @Summary User login
    // @Description Authenticate user and return access/refresh tokens
    // @Tags Auth
    // @Accept json
    // @Produce json
    // @Param input body object{email=string,password=string} true "Login request"
    // @Success 200 {object} object{access_token=string,refresh_token=string,user=object}
    // @Failure 401 {object} object{error=string}
    // @Router /auth/login [post]
    var body struct{ Email, Password string }
    if err := c.ShouldBindJSON(&body); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid"}); return }
    at, rt, user, err := s.authService.Login(c.Request.Context(), body.Email, body.Password)
    if err != nil { c.JSON(http.StatusUnauthorized, gin.H{"error":"invalid"}); return }
    c.JSON(http.StatusOK, gin.H{"access_token": at, "refresh_token": rt, "user": gin.H{"id": user.ID, "email": user.Email}})
}

func (s *Server) refresh(c *gin.Context) {
    // @Summary Refresh tokens
    // @Description Generate new access/refresh tokens using refresh token
    // @Tags Auth
    // @Accept json
    // @Produce json
    // @Param input body object{user_id=integer,refresh_token=string} true "Refresh request"
    // @Success 200 {object} object{access_token=string,refresh_token=string}
    // @Failure 401 {object} object{error=string}
    // @Router /auth/refresh [post]
    var body struct{ UserID uint `json:"user_id"`; RefreshToken string `json:"refresh_token"` }
    if err := c.ShouldBindJSON(&body); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid"}); return }
    at, rt, err := s.authService.Refresh(c.Request.Context(), body.UserID, body.RefreshToken)
    if err != nil { c.JSON(http.StatusUnauthorized, gin.H{"error":"invalid"}); return }
    c.JSON(http.StatusOK, gin.H{"access_token": at, "refresh_token": rt})
}

func (s *Server) logout(c *gin.Context) {
    // @Summary Logout user
    // @Description Invalidate refresh token
    // @Tags Auth
    // @Accept json
    // @Produce json
    // @Param input body object{user_id=integer} true "Logout request"
    // @Success 200 {object} object{ok=boolean}
    // @Security Bearer
    // @Router /auth/logout [post]
    var body struct{ UserID uint `json:"user_id"` }
    if err := c.ShouldBindJSON(&body); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid"}); return }
    if err := s.authService.Logout(c.Request.Context(), body.UserID); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"internal"}); return }
    c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (s *Server) me(c *gin.Context) {
    // @Summary Get current user
    // @Description Retrieve authenticated user info
    // @Tags Auth
    // @Produce json
    // @Success 200 {object} object{id=integer,email=string,created_at=string}
    // @Failure 404 {object} object{error=string}
    // @Security Bearer
    // @Router /me [get]
    uid, _ := c.Get("user_id")
    var user models.User
    if err := s.db.First(&user, uid).Error; err != nil { c.JSON(http.StatusNotFound, gin.H{"error":"notfound"}); return }
    c.JSON(http.StatusOK, gin.H{"id": user.ID, "email": user.Email, "created_at": user.CreatedAt})
}

func (s *Server) jwtMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if len(authHeader) < 7 || authHeader[:7] != "Bearer " { c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error":"unauth"}); return }
        token := authHeader[7:]
        claims, err := auth.ParseToken(s.cfg.JwtSecret, token)
        if err != nil { c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error":"unauth"}); return }
        c.Set("user_id", claims.UserID)
        c.Next()
    }
}

// helpers
// no helpers required; using os.Getenv directly

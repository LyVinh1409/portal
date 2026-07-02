package handlers

import (
    "net/http"
    "strconv"

    "github.com/example/project/backend/internal/user"
    "github.com/gin-gonic/gin"
    "github.com/go-playground/validator/v10"
)

type UserHandler struct{
    svc *user.Service
    validate *validator.Validate
}

func NewUserHandler(s *user.Service) *UserHandler {
    return &UserHandler{svc: s, validate: validator.New()}
}

type createUserReq struct{
    Email string `json:"email" validate:"required,email,max=255"`
    Password string `json:"password" validate:"required,min=6"`
}

type updateUserReq struct{
    Email *string `json:"email" validate:"omitempty,email,max=255"`
    Password *string `json:"password" validate:"omitempty,min=6"`
}

func (h *UserHandler) RegisterRoutes(rg *gin.RouterGroup) {
    rg.GET("/users", h.list)
    rg.POST("/users", h.create)
    rg.GET("/users/:id", h.get)
    rg.PUT("/users/:id", h.update)
    rg.DELETE("/users/:id", h.delete)
}

func (h *UserHandler) list(c *gin.Context) {
    limit := 20
    offset := 0
    if l := c.Query("limit"); l != "" { if v, err := strconv.Atoi(l); err == nil { limit = v } }
    if o := c.Query("offset"); o != "" { if v, err := strconv.Atoi(o); err == nil { offset = v } }
    users, total, err := h.svc.List(c.Request.Context(), limit, offset)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"internal"}); return }
    c.JSON(http.StatusOK, gin.H{"data": users, "total": total})
}

func (h *UserHandler) create(c *gin.Context) {
    var req createUserReq
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid"}); return }
    if err := h.validate.Struct(req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"validation", "details": err.Error()}); return }
    u, err := h.svc.Create(c.Request.Context(), req.Email, req.Password)
    if err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"create"}); return }
    c.JSON(http.StatusCreated, gin.H{"data": u})
}

func (h *UserHandler) get(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    u, err := h.svc.GetByID(c.Request.Context(), uint(id))
    if err != nil { c.JSON(http.StatusNotFound, gin.H{"error":"notfound"}); return }
    c.JSON(http.StatusOK, gin.H{"data": u})
}

func (h *UserHandler) update(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var req updateUserReq
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid"}); return }
    if err := h.validate.Struct(req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"validation", "details": err.Error()}); return }
    u, err := h.svc.Update(c.Request.Context(), uint(id), req.Email, req.Password)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"update"}); return }
    c.JSON(http.StatusOK, gin.H{"data": u})
}

func (h *UserHandler) delete(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.svc.Delete(c.Request.Context(), uint(id)); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"delete"}); return }
    c.JSON(http.StatusOK, gin.H{"ok": true})
}

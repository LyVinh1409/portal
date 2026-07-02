package handlers

import (
    "net/http"
    "strconv"

    "github.com/example/project/backend/internal/news"
    "github.com/gin-gonic/gin"
    "github.com/go-playground/validator/v10"
)

type NewsHandler struct{
    svc *news.Service
    validate *validator.Validate
}

func NewNewsHandler(s *news.Service) *NewsHandler { return &NewsHandler{svc: s, validate: validator.New()} }

type createNewsReq struct{
    Title string `json:"title" validate:"required,max=255"`
    Slug string `json:"slug" validate:"omitempty,max=255"`
    Excerpt string `json:"excerpt" validate:"omitempty,max=512"`
    Body string `json:"body" validate:"required"`
    SeoTitle string `json:"seo_title" validate:"omitempty,max=255"`
    SeoDescription string `json:"seo_description" validate:"omitempty,max=512"`
    FeaturedKey *string `json:"featured_key"`
    PublishedAt *string `json:"published_at"`
    TagIDs []uint `json:"tag_ids"`
}

type updateNewsReq struct{
    Title *string `json:"title" validate:"omitempty,max=255"`
    Slug *string `json:"slug" validate:"omitempty,max=255"`
    Excerpt *string `json:"excerpt" validate:"omitempty,max=512"`
    Body *string `json:"body" validate:"omitempty"`
    SeoTitle *string `json:"seo_title" validate:"omitempty,max=255"`
    SeoDescription *string `json:"seo_description" validate:"omitempty,max=512"`
    FeaturedKey *string `json:"featured_key"`
    PublishedAt *string `json:"published_at"`
    TagIDs []uint `json:"tag_ids"`
}

func (h *NewsHandler) RegisterRoutes(rg *gin.RouterGroup) {
    rg.GET("/news", h.list)
    rg.POST("/news", h.create)
    rg.GET("/news/:id", h.getByID)
    rg.GET("/news/slug/:slug", h.getBySlug)
    rg.PUT("/news/:id", h.update)
    rg.DELETE("/news/:id", h.delete)
    rg.POST("/news/:id/comments", h.addComment)
}

func (h *NewsHandler) list(c *gin.Context) {
    limit := 20
    offset := 0
    if l := c.Query("limit"); l != "" { if v, err := strconv.Atoi(l); err == nil { limit = v } }
    if o := c.Query("offset"); o != "" { if v, err := strconv.Atoi(o); err == nil { offset = v } }
    list, total, err := h.svc.List(c.Request.Context(), limit, offset)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"internal"}); return }
    c.JSON(http.StatusOK, gin.H{"data": list, "total": total})
}

func (h *NewsHandler) create(c *gin.Context) {
    var req createNewsReq
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid"}); return }
    if err := h.validate.Struct(req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"validation", "details": err.Error()}); return }
    var pubPtr *time.Time
    // parse publishedAt if provided
    if req.PublishedAt != nil && *req.PublishedAt != "" {
        if t, err := time.Parse(time.RFC3339, *req.PublishedAt); err == nil { pubPtr = &t }
    }
    n, err := h.svc.Create(c.Request.Context(), req.Title, req.Excerpt, req.Body, req.Slug, req.SeoTitle, req.SeoDescription, req.FeaturedKey, pubPtr, req.TagIDs)
    if err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"create", "details": err.Error()}); return }
    c.JSON(http.StatusCreated, gin.H{"data": n})
}

func (h *NewsHandler) getByID(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    n, err := h.svc.GetByID(c.Request.Context(), uint(id))
    if err != nil { c.JSON(http.StatusNotFound, gin.H{"error":"notfound"}); return }
    c.JSON(http.StatusOK, gin.H{"data": n})
}

func (h *NewsHandler) getBySlug(c *gin.Context) {
    slug := c.Param("slug")
    n, err := h.svc.GetBySlug(c.Request.Context(), slug)
    if err != nil { c.JSON(http.StatusNotFound, gin.H{"error":"notfound"}); return }
    c.JSON(http.StatusOK, gin.H{"data": n})
}

func (h *NewsHandler) update(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var req updateNewsReq
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid"}); return }
    if err := h.validate.Struct(req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"validation", "details": err.Error()}); return }
    var pubPtr *time.Time
    if req.PublishedAt != nil && *req.PublishedAt != "" {
        if t, err := time.Parse(time.RFC3339, *req.PublishedAt); err == nil { pubPtr = &t }
    }
    n, err := h.svc.Update(c.Request.Context(), uint(id), req.Title, req.Excerpt, req.Body, req.Slug, req.SeoTitle, req.SeoDescription, req.FeaturedKey, pubPtr, req.TagIDs)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"update", "details": err.Error()}); return }
    c.JSON(http.StatusOK, gin.H{"data": n})
}

func (h *NewsHandler) delete(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.svc.Delete(c.Request.Context(), uint(id)); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"delete", "details": err.Error()}); return }
    c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *NewsHandler) addComment(c *gin.Context) {
    // simple comment creation (no moderation)
    var req struct{ AuthorName, AuthorEmail, Body string; ParentID *uint }
    id, _ := strconv.Atoi(c.Param("id"))
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid"}); return }
    if req.AuthorName == "" || req.Body == "" { c.JSON(http.StatusBadRequest, gin.H{"error":"validation"}); return }
    cm := map[string]interface{}{"news_id": id, "parent_id": req.ParentID, "author_name": req.AuthorName, "author_email": req.AuthorEmail, "body": req.Body}
    if err := h.svc.DB().Exec("INSERT INTO comments (news_id, parent_id, author_name, author_email, body) VALUES (?, ?, ?, ?, ?)", cm["news_id"], cm["parent_id"], cm["author_name"], cm["author_email"], cm["body"]).Error; err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"create"}); return }
    c.JSON(http.StatusCreated, gin.H{"ok": true})
}

func (h *NewsHandler) ListPublic(c *gin.Context) {
    // @Summary List published news
    // @Description Get list of published news articles for public
    // @Tags News
    // @Produce json
    // @Param limit query int false "Limit" default(10)
    // @Param offset query int false "Offset" default(0)
    // @Success 200 {object} object{data=array}
    // @Router /news [get]
    limit := 10
    offset := 0
    if l := c.Query("limit"); l != "" { if lv, _ := strconv.Atoi(l); lv > 0 { limit = lv } }
    if o := c.Query("offset"); o != "" { if ov, _ := strconv.Atoi(o); ov >= 0 { offset = ov } }
    items, err := h.svc.ListPublished(c.Request.Context(), int64(limit), int64(offset))
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":err.Error()}); return }
    c.JSON(http.StatusOK, gin.H{"data": items})
}

func (h *NewsHandler) DetailPublic(c *gin.Context) {
    // @Summary Get published news by ID
    // @Description Retrieve a single published news article
    // @Tags News
    // @Produce json
    // @Param id path int true "News ID"
    // @Success 200 {object} object{data=object}
    // @Failure 404 {object} object{error=string}
    // @Router /news/{id} [get]
    id, _ := strconv.Atoi(c.Param("id"))
    n, err := h.svc.GetByID(c.Request.Context(), uint(id))
    if err != nil { c.JSON(http.StatusNotFound, gin.H{"error":"notfound"}); return }
    c.JSON(http.StatusOK, gin.H{"data": n})
}


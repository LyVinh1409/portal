package handlers

import (
    "net/http"
    "strconv"
    "time"

    "github.com/example/project/backend/internal/banner"
    "github.com/gin-gonic/gin"
    "github.com/go-playground/validator/v10"
)

type BannerHandler struct{
    svc *banner.Service
    validate *validator.Validate
}

func NewBannerHandler(s *banner.Service) *BannerHandler { return &BannerHandler{svc: s, validate: validator.New()} }

type createBannerReq struct{
    Title string `json:"title" validate:"required,max=255"`
    ImageKey string `json:"image_key" validate:"required"`
    Link *string `json:"link"`
    Position *string `json:"position"`
    IsActive *bool `json:"is_active"`
    StartAt *string `json:"start_at"`
    EndAt *string `json:"end_at"`
}

type updateBannerReq struct{
    Title *string `json:"title" validate:"omitempty,max=255"`
    ImageKey *string `json:"image_key"`
    Link *string `json:"link"`
    Position *string `json:"position"`
    IsActive *bool `json:"is_active"`
    StartAt *string `json:"start_at"`
    EndAt *string `json:"end_at"`
}

func (h *BannerHandler) RegisterRoutes(rg *gin.RouterGroup) {
    rg.GET("/banners", h.list)
    rg.POST("/banners", h.create)
    rg.GET("/banners/:id", h.get)
    rg.PUT("/banners/:id", h.update)
    rg.DELETE("/banners/:id", h.delete)
}

func parseTimePtr(s *string) *time.Time {
    if s == nil || *s == "" { return nil }
    if t, err := time.Parse(time.RFC3339, *s); err == nil { return &t }
    return nil
}

func (h *BannerHandler) list(c *gin.Context) {
    limit := 50
    offset := 0
    if l := c.Query("limit"); l != "" { if v, err := strconv.Atoi(l); err == nil { limit = v } }
    if o := c.Query("offset"); o != "" { if v, err := strconv.Atoi(o); err == nil { offset = v } }
    list, total, err := h.svc.List(c.Request.Context(), limit, offset)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"internal"}); return }
    c.JSON(http.StatusOK, gin.H{"data": list, "total": total})
}

func (h *BannerHandler) create(c *gin.Context) {
    var req createBannerReq
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid"}); return }
    if err := h.validate.Struct(req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"validation", "details": err.Error()}); return }
    start := parseTimePtr(req.StartAt)
    end := parseTimePtr(req.EndAt)
    pos := "hero"
    if req.Position != nil { pos = *req.Position }
    active := true
    if req.IsActive != nil { active = *req.IsActive }
    b, err := h.svc.Create(c.Request.Context(), req.Title, req.ImageKey, pointerString(req.Link), pos, active, start, end)
    if err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"create", "details": err.Error()}); return }
    c.JSON(http.StatusCreated, gin.H{"data": b})
}

func pointerString(p *string) string { if p == nil { return "" }; return *p }

func (h *BannerHandler) get(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    b, err := h.svc.GetByID(c.Request.Context(), uint(id))
    if err != nil { c.JSON(http.StatusNotFound, gin.H{"error":"notfound"}); return }
    c.JSON(http.StatusOK, gin.H{"data": b})
}

func (h *BannerHandler) update(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var req updateBannerReq
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid"}); return }
    if err := h.validate.Struct(req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"validation", "details": err.Error()}); return }
    start := parseTimePtr(req.StartAt)
    end := parseTimePtr(req.EndAt)
    b, err := h.svc.Update(c.Request.Context(), uint(id), req.Title, req.ImageKey, req.Link, req.Position, req.IsActive, start, end)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"update", "details": err.Error()}); return }
    c.JSON(http.StatusOK, gin.H{"data": b})
}

func (h *BannerHandler) delete(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.svc.Delete(c.Request.Context(), uint(id)); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"delete", "details": err.Error()}); return }
    c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *BannerHandler) ListPublic(c *gin.Context) {
    // @Summary List active banners
    // @Description Get list of active banners for public display
    // @Tags Banners
    // @Produce json
    // @Param position query string false "Position filter"
    // @Success 200 {object} object{data=array}
    // @Router /banners [get]
    list, err := h.svc.ListActive(c.Request.Context())
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"internal"}); return }
    c.JSON(http.StatusOK, gin.H{"data": list})
}

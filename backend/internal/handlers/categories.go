package handlers

import (
    "net/http"
    "strconv"

    "github.com/example/project/backend/internal/category"
    "github.com/gin-gonic/gin"
    "github.com/go-playground/validator/v10"
)

type CategoryHandler struct{
    svc *category.Service
    validate *validator.Validate
}

func NewCategoryHandler(s *category.Service) *CategoryHandler { return &CategoryHandler{svc: s, validate: validator.New()} }

type createCatReq struct{
    Name string `json:"name" validate:"required,max=255"`
    Slug string `json:"slug" validate:"required,max=255"`
    ParentID *uint `json:"parent_id"`
}

type updateCatReq struct{
    Name *string `json:"name" validate:"omitempty,max=255"`
    Slug *string `json:"slug" validate:"omitempty,max=255"`
    ParentID *uint `json:"parent_id"`
}

func (h *CategoryHandler) RegisterRoutes(rg *gin.RouterGroup) {
    rg.GET("/categories", h.list)
    rg.POST("/categories", h.create)
    rg.GET("/categories/:id", h.get)
    rg.PUT("/categories/:id", h.update)
    rg.DELETE("/categories/:id", h.delete)
    rg.GET("/categories/:id/children", h.children)
}

func (h *CategoryHandler) list(c *gin.Context) {
    limit := 100
    offset := 0
    if l := c.Query("limit"); l != "" { if v, err := strconv.Atoi(l); err == nil { limit = v } }
    if o := c.Query("offset"); o != "" { if v, err := strconv.Atoi(o); err == nil { offset = v } }
    cats, total, err := h.svc.ListAll(c.Request.Context(), limit, offset)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"internal"}); return }
    c.JSON(http.StatusOK, gin.H{"data": cats, "total": total})
}

func (h *CategoryHandler) create(c *gin.Context) {
    var req createCatReq
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid"}); return }
    if err := h.validate.Struct(req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"validation", "details": err.Error()}); return }
    cat, err := h.svc.Create(c.Request.Context(), req.Name, req.Slug, req.ParentID)
    if err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"create", "details": err.Error()}); return }
    c.JSON(http.StatusCreated, gin.H{"data": cat})
}

func (h *CategoryHandler) get(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    cat, err := h.svc.GetByID(c.Request.Context(), uint(id))
    if err != nil { c.JSON(http.StatusNotFound, gin.H{"error":"notfound"}); return }
    c.JSON(http.StatusOK, gin.H{"data": cat})
}

func (h *CategoryHandler) update(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var req updateCatReq
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid"}); return }
    if err := h.validate.Struct(req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"validation", "details": err.Error()}); return }
    cat, err := h.svc.Update(c.Request.Context(), uint(id), req.Name, req.Slug, req.ParentID)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"update", "details": err.Error()}); return }
    c.JSON(http.StatusOK, gin.H{"data": cat})
}

func (h *CategoryHandler) delete(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.svc.Delete(c.Request.Context(), uint(id)); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"delete", "details": err.Error()}); return }
    c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *CategoryHandler) children(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    pid := uint(id)
    cats, err := h.svc.ListChildren(c.Request.Context(), &pid)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"internal"}); return }
    c.JSON(http.StatusOK, gin.H{"data": cats})
}

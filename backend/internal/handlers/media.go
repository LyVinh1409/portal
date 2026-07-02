package handlers

import (
    "context"
    "net/http"
    "strconv"
    "time"

    "github.com/example/project/backend/internal/media"
    "github.com/example/project/backend/internal/storage"
    "github.com/gin-gonic/gin"
    "github.com/minio/minio-go/v7"
    "gorm.io/gorm"
)

type MediaHandler struct{
    svc *media.Service
    storage *storage.MinioClient
    db *gorm.DB
}

func NewMediaHandler(svc *media.Service, storage *storage.MinioClient, db *gorm.DB) *MediaHandler { return &MediaHandler{svc: svc, storage: storage, db: db} }

func (h *MediaHandler) RegisterRoutes(rg *gin.RouterGroup) {
    rg.GET("/media", h.list)
    rg.POST("/media/upload", h.upload)
    rg.GET("/media/:id", h.get)
    rg.DELETE("/media/:id", h.delete)
    rg.GET("/media/folders", h.folders)
}

func (h *MediaHandler) list(c *gin.Context) {
    folder := c.Query("folder")
    if folder == "" { folder = "root" }
    limit := 50
    offset := 0
    if l := c.Query("limit"); l != "" { if v, err := strconv.Atoi(l); err == nil { limit = v } }
    if o := c.Query("offset"); o != "" { if v, err := strconv.Atoi(o); err == nil { offset = v } }
    list, total, err := h.svc.ListByFolder(c.Request.Context(), folder, limit, offset)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"internal"}); return }
    c.JSON(http.StatusOK, gin.H{"data": list, "total": total})
}

func (h *MediaHandler) upload(c *gin.Context) {
    folder := c.PostForm("folder")
    if folder == "" { folder = "root" }
    f, err := c.FormFile("file")
    if err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"file_required"}); return }
    src, err := f.Open()
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"open"}); return }
    defer src.Close()
    key := "media/" + strconv.FormatInt(time.Now().UnixNano(), 10) + "_" + f.Filename
    // upload to minio
    ctx := context.Background()
    _, err = h.storage.Client.PutObject(ctx, h.storage.Bucket, key, src, f.Size, minio.PutObjectOptions{ContentType: f.Header.Get("Content-Type")})
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"upload"}); return }
    // register metadata
    mediaType := "image"
    if f.Header.Get("Content-Type") == "video/mp4" { mediaType = "video" }
    m, err := h.svc.RegisterMedia(c.Request.Context(), key, folder, mediaType, f.Header.Get("Content-Type"), f.Size, nil, nil, nil)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"register"}); return }
    c.JSON(http.StatusOK, gin.H{"data": m})
}

func (h *MediaHandler) get(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    m, err := h.svc.GetByID(c.Request.Context(), uint(id))
    if err != nil { c.JSON(http.StatusNotFound, gin.H{"error":"notfound"}); return }
    c.JSON(http.StatusOK, gin.H{"data": m})
}

func (h *MediaHandler) delete(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.svc.Delete(c.Request.Context(), uint(id)); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"delete"}); return }
    c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *MediaHandler) folders(c *gin.Context) {
    // list distinct folders
    var rows []struct{ Folder string }
    if err := h.db.Raw("SELECT DISTINCT folder FROM media ORDER BY folder").Scan(&rows).Error; err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"internal"}); return }
    folders := make([]string, 0, len(rows))
    for _, r := range rows { folders = append(folders, r.Folder) }
    c.JSON(http.StatusOK, gin.H{"data": folders})
}

func (h *MediaHandler) ListPublic(c *gin.Context) {
    // @Summary List media by folder
    // @Description Get list of media files from a specific folder
    // @Tags Media
    // @Produce json
    // @Param folder query string false "Folder name" default(root)
    // @Param limit query int false "Limit" default(20)
    // @Param offset query int false "Offset" default(0)
    // @Success 200 {object} object{data=array,total=integer}
    // @Router /media/list [get]
    folder := c.Query("folder")
    if folder == "" { folder = "root" }
    limit := 20
    offset := 0
    if l := c.Query("limit"); l != "" { if v, err := strconv.Atoi(l); err == nil { limit = v } }
    if o := c.Query("offset"); o != "" { if v, err := strconv.Atoi(o); err == nil { offset = v } }
    list, total, err := h.svc.ListByFolder(c.Request.Context(), folder, limit, offset)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"internal"}); return }
    c.JSON(http.StatusOK, gin.H{"data": list, "total": total})
}

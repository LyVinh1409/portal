package handlers

import (
    "context"
    "fmt"
    "net/http"
    "time"

    "github.com/minio/minio-go/v7"
    "gorm.io/gorm"

    "github.com/example/project/backend/internal/storage"
    "github.com/gin-gonic/gin"
)

type UploadHandler struct{
    storage *storage.MinioClient
    db *gorm.DB
}

func NewUploadHandler(s *storage.MinioClient, db *gorm.DB) *UploadHandler { return &UploadHandler{storage: s, db: db} }

func (h *UploadHandler) RegisterRoutes(rg *gin.RouterGroup) {
    rg.POST("/upload", h.upload)
}

func (h *UploadHandler) upload(c *gin.Context) {
    f, err := c.FormFile("file")
    if err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"file_required"}); return }
    src, err := f.Open()
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"open"}); return }
    defer src.Close()
    key := fmt.Sprintf("uploads/%d_%s", time.Now().UnixNano(), f.Filename)
    ctx := context.Background()
    _, err = h.storage.Client.PutObject(ctx, h.storage.Bucket, key, src, f.Size, minio.PutObjectOptions{ContentType: f.Header.Get("Content-Type")})
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"upload"}); return }
    url := fmt.Sprintf("%s/%s", h.storage.Client.EndpointURL(), key)
    if err := h.db.Exec("INSERT INTO uploads (key, url, content_type, size, created_at) VALUES (?, ?, ?, ?, now())", key, url, f.Header.Get("Content-Type"), f.Size).Error; err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error":"db"}); return }
    c.JSON(http.StatusOK, gin.H{"key": key, "url": url})
}

package handlers

import (
    "net/http"

    "github.com/example/project/backend/internal/models"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type DashboardHandler struct{
    db *gorm.DB
}

func NewDashboardHandler(db *gorm.DB) *DashboardHandler { return &DashboardHandler{db: db} }

func (h *DashboardHandler) RegisterRoutes(rg *gin.RouterGroup) {
    rg.GET("/dashboard/stats", h.stats)
    rg.GET("/dashboard/recent", h.recent)
}

func (h *DashboardHandler) stats(c *gin.Context) {
    var uc, nc, mc, bc, cc, catc int64
    h.db.Model(&models.User{}).Count(&uc)
    h.db.Model(&models.News{}).Count(&nc)
    h.db.Model(&models.Media{}).Count(&mc)
    h.db.Model(&models.Banner{}).Count(&bc)
    h.db.Model(&models.Comment{}).Count(&cc)
    h.db.Model(&models.Category{}).Count(&catc)
    c.JSON(http.StatusOK, gin.H{"users": uc, "news": nc, "media": mc, "banners": bc, "comments": cc, "categories": catc})
}

func (h *DashboardHandler) recent(c *gin.Context) {
    // recent users
    var users []models.User
    h.db.Order("created_at desc").Limit(5).Find(&users)
    var news []models.News
    h.db.Order("created_at desc").Limit(5).Find(&news)
    var media []models.Media
    h.db.Order("created_at desc").Limit(8).Find(&media)
    c.JSON(http.StatusOK, gin.H{"users": users, "news": news, "media": media})
}

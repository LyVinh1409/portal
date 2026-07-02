package models

import "time"

type User struct {
    ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    Email        string    `gorm:"size:255;not null;uniqueIndex" json:"email"`
    PasswordHash string    `gorm:"size:255;not null" json:"-"`
    CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type Role struct {
    ID   uint   `gorm:"primaryKey;autoIncrement" json:"id"`
    Name string `gorm:"size:100;not null;uniqueIndex" json:"name"`
    Description string `gorm:"size:500" json:"description"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type UserRole struct {
    ID     uint `gorm:"primaryKey;autoIncrement" json:"id"`
    UserID uint `gorm:"not null;index" json:"user_id"`
    RoleID uint `gorm:"not null;index" json:"role_id"`
}

type Permission struct {
    ID   uint   `gorm:"primaryKey;autoIncrement" json:"id"`
    Name string `gorm:"size:255;not null;uniqueIndex" json:"name"`
    Description string `gorm:"size:500" json:"description"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type RolePermission struct {
    RoleID uint `gorm:"primaryKey;autoIncrement:false" json:"role_id"`
    PermissionID uint `gorm:"primaryKey;autoIncrement:false" json:"permission_id"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type Category struct {
    ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    Name      string    `gorm:"size:255;not null;index" json:"name"`
    Slug      string    `gorm:"size:255;not null;index" json:"slug"`
    ParentID  *uint     `gorm:"index" json:"parent_id"`
    Path      string    `gorm:"size:1024;index" json:"path"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type Tag struct {
    ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    Name      string    `gorm:"size:255;not null;index" json:"name"`
    Slug      string    `gorm:"size:255;not null;index" json:"slug"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type News struct {
    ID            uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    Title         string    `gorm:"size:255;not null" json:"title"`
    Slug          string    `gorm:"size:255;not null;index" json:"slug"`
    Excerpt       string    `gorm:"size:512" json:"excerpt"`
    Body          string    `gorm:"type:text;not null" json:"body"`
    SeoTitle      string    `gorm:"size:255" json:"seo_title"`
    SeoDescription string   `gorm:"size:512" json:"seo_description"`
    FeaturedImage string    `gorm:"size:1024" json:"featured_image_url"`
    PublishedAt   *time.Time `json:"published_at"`
    CreatedAt     time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type Comment struct {
    ID uint `gorm:"primaryKey;autoIncrement" json:"id"`
    NewsID uint `gorm:"index;not null" json:"news_id"`
    ParentID *uint `gorm:"index" json:"parent_id"`
    AuthorName string `gorm:"size:255;not null" json:"author_name"`
    AuthorEmail string `gorm:"size:255" json:"author_email"`
    Body string `gorm:"type:text;not null" json:"body"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type Upload struct {
    ID uint `gorm:"primaryKey;autoIncrement" json:"id"`
    Key string `gorm:"size:1024;not null;index" json:"key"`
    URL string `gorm:"size:2048;not null" json:"url"`
    ContentType string `gorm:"size:255" json:"content_type"`
    Size int64 `json:"size"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type Banner struct {
    ID uint `gorm:"primaryKey;autoIncrement" json:"id"`
    Title string `gorm:"size:255;not null" json:"title"`
    ImageKey string `gorm:"size:1024;not null" json:"image_key"`
    ImageURL string `gorm:"size:2048;not null" json:"image_url"`
    Link string `gorm:"size:1024" json:"link"`
    Position string `gorm:"size:100;index;default:hero" json:"position"`
    IsActive bool `gorm:"default:true;index" json:"is_active"`
    StartAt *time.Time `json:"start_at"`
    EndAt *time.Time `json:"end_at"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type Media struct {
    ID uint `gorm:"primaryKey;autoIncrement" json:"id"`
    Key string `gorm:"size:1024;not null;index" json:"key"`
    URL string `gorm:"size:2048;not null" json:"url"`
    Folder string `gorm:"size:255;index;default:'root'" json:"folder"`
    MediaType string `gorm:"size:50;not null" json:"media_type"`
    ContentType string `gorm:"size:255" json:"content_type"`
    Size int64 `json:"size"`
    ThumbKey *string `gorm:"size:1024" json:"thumb_key"`
    PreviewURL *string `gorm:"size:2048" json:"preview_url"`
    DurationSeconds *int `json:"duration_seconds"`
    Metadata map[string]interface{} `gorm:"type:jsonb" json:"metadata"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

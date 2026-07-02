package models

import "time"

type User struct {
    ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    Email        string    `gorm:"size:255;not null;uniqueIndex" json:"email"`
    PasswordHash string    `gorm:"size:255;not null" json:"-"`
    FullName     string    `gorm:"size:255" json:"full_name"`
    Avatar       string    `gorm:"size:1024" json:"avatar"`
    Status       string    `gorm:"size:50;default:'active';index" json:"status"` // active, suspended, banned
    TwoFAEnabled bool      `gorm:"default:false" json:"two_fa_enabled"`
    TwoFASecret  string    `gorm:"size:255" json:"-"` // TOTP secret
    TwoFAMethod  string    `gorm:"size:50;default:'app'" json:"two_fa_method"` // app, sms
    PhoneNumber  string    `gorm:"size:20" json:"phone_number"`
    LastLogin    *time.Time `json:"last_login"`
    CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
    UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`
    // Relations
    Roles []Role `gorm:"many2many:user_roles;" json:"roles,omitempty"`
}

type Role struct {
    ID   uint   `gorm:"primaryKey;autoIncrement" json:"id"`
    Name string `gorm:"size:100;not null;uniqueIndex" json:"name"` // admin, editor, contributor, member, guest
    Description string `gorm:"size:500" json:"description"`
    Priority int `gorm:"default:0;index" json:"priority"` // higher = more powerful
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
    // Relations
    Permissions []Permission `gorm:"many2many:role_permissions;" json:"permissions,omitempty"`
}

type UserRole struct {
    ID     uint `gorm:"primaryKey;autoIncrement" json:"id"`
    UserID uint `gorm:"not null;index" json:"user_id"`
    RoleID uint `gorm:"not null;index" json:"role_id"`
}

type Permission struct {
    ID   uint   `gorm:"primaryKey;autoIncrement" json:"id"`
    Name string `gorm:"size:255;not null;uniqueIndex" json:"name"` // e.g. news:create, news:edit, news:delete
    Description string `gorm:"size:500" json:"description"`
    Category string `gorm:"size:100;index" json:"category"` // news, users, roles, settings
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
    AuthorID      uint      `gorm:"index" json:"author_id"`
    Status        string    `gorm:"size:50;default:'draft';index" json:"status"` // draft, pending_review, approved, published, rejected
    ReviewedBy    *uint     `json:"reviewed_by"`
    ReviewNotes   string    `gorm:"type:text" json:"review_notes"`
    PublishedAt   *time.Time `json:"published_at"`
    ScheduledAt   *time.Time `json:"scheduled_at"` // For scheduled publishing
    ExpiresAt     *time.Time `json:"expires_at"` // For auto-removal
    ViewCount     int64     `gorm:"default:0;index" json:"view_count"`
    CreatedAt     time.Time `gorm:"autoCreateTime" json:"created_at"`
    UpdatedAt     time.Time `gorm:"autoUpdateTime" json:"updated_at"`
    // Relations
    Author   User        `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
    Reviewer *User       `gorm:"foreignKey:ReviewedBy" json:"reviewer,omitempty"`
}

type Comment struct {
    ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    NewsID    uint      `gorm:"index;not null" json:"news_id"`
    ParentID  *uint     `gorm:"index" json:"parent_id"`
    UserID    *uint     `gorm:"index" json:"user_id"` // null if anonymous
    AuthorName string   `gorm:"size:255;not null" json:"author_name"`
    AuthorEmail string  `gorm:"size:255" json:"author_email"`
    Body      string    `gorm:"type:text;not null" json:"body"`
    Status    string    `gorm:"size:50;default:'pending';index" json:"status"` // pending, approved, rejected
    Rating    int       `gorm:"default:0" json:"rating"` // 1-5 stars
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
    Position string `gorm:"size:100;index;default:hero" json:"position"` // hero, sidebar, footer
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
    MediaType string `gorm:"size:50;not null" json:"media_type"` // image, video, document
    ContentType string `gorm:"size:255" json:"content_type"`
    Size int64 `json:"size"`
    ThumbKey *string `gorm:"size:1024" json:"thumb_key"`
    PreviewURL *string `gorm:"size:2048" json:"preview_url"`
    DurationSeconds *int `json:"duration_seconds"`
    Metadata map[string]interface{} `gorm:"type:jsonb" json:"metadata"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

// Newsletter subscriber
type NewsletterSubscriber struct {
    ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    Email     string    `gorm:"size:255;not null;uniqueIndex" json:"email"`
    FullName  string    `gorm:"size:255" json:"full_name"`
    Status    string    `gorm:"size:50;default:'subscribed';index" json:"status"` // subscribed, unsubscribed
    Token     string    `gorm:"size:255;uniqueIndex" json:"token"` // For unsubscribe link
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

// Analytics & logs
type ViewLog struct {
    ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    NewsID    *uint     `gorm:"index" json:"news_id"`
    UserID    *uint     `gorm:"index" json:"user_id"`
    IPAddress string    `gorm:"size:50;index" json:"ip_address"`
    UserAgent string    `gorm:"type:text" json:"user_agent"`
    Referer   string    `gorm:"size:1024" json:"referer"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

// Poll/Survey
type Poll struct {
    ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    Title     string    `gorm:"size:255;not null" json:"title"`
    Question  string    `gorm:"type:text;not null" json:"question"`
    Status    string    `gorm:"size:50;default:'active';index" json:"status"` // active, closed
    IsPublic  bool      `gorm:"default:true" json:"is_public"`
    StartsAt  time.Time `json:"starts_at"`
    EndsAt    *time.Time `json:"ends_at"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type PollOption struct {
    ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    PollID    uint      `gorm:"not null;index" json:"poll_id"`
    Label     string    `gorm:"size:500;not null" json:"label"`
    Order     int       `gorm:"default:0" json:"order"`
    Votes     int64     `gorm:"default:0" json:"votes"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type PollVote struct {
    ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    PollID    uint      `gorm:"not null;index" json:"poll_id"`
    OptionID  uint      `gorm:"not null;index" json:"option_id"`
    UserID    *uint     `gorm:"index" json:"user_id"` // null if anonymous
    IPAddress string    `gorm:"size:50;index" json:"ip_address"` // For anonymous voting
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

// Activity audit log
type AuditLog struct {
    ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    UserID    *uint     `gorm:"index" json:"user_id"`
    Action    string    `gorm:"size:255;not null;index" json:"action"` // create, update, delete, publish, etc
    Entity    string    `gorm:"size:100;index" json:"entity"` // news, user, category, etc
    EntityID  uint      `gorm:"index" json:"entity_id"`
    OldValue  string    `gorm:"type:text" json:"old_value"`
    NewValue  string    `gorm:"type:text" json:"new_value"`
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

package news

import (
    "context"
    "fmt"
    "strings"
    "time"

    "github.com/example/project/backend/internal/models"
    "github.com/example/project/backend/internal/storage"
    "gorm.io/gorm"
)

type Service struct{
    db *gorm.DB
    storage *storage.MinioClient
}

func NewService(db *gorm.DB, storage *storage.MinioClient) *Service { return &Service{db: db, storage: storage} }

func makeSlug(s string) string {
    s = strings.TrimSpace(strings.ToLower(s))
    s = strings.ReplaceAll(s, " ", "-")
    return s
}

func (s *Service) Create(ctx context.Context, title, excerpt, body, slug string, seoTitle, seoDesc string, featuredKey *string, publishedAt *time.Time, tagIDs []uint) (*models.News, error) {
    if slug == "" { slug = makeSlug(title) }
    news := &models.News{Title: title, Excerpt: excerpt, Body: body, Slug: slug, SeoTitle: seoTitle, SeoDescription: seoDesc, CreatedAt: time.Now(), PublishedAt: publishedAt}
    if featuredKey != nil {
        // build URL from storage
        if s.storage != nil {
            news.FeaturedImage = fmt.Sprintf("%s/%s", s.storage.Client.EndpointURL(), *featuredKey)
        } else {
            news.FeaturedImage = *featuredKey
        }
    }
    if err := s.db.Create(news).Error; err != nil { return nil, err }
    // attach tags
    for _, tid := range tagIDs {
        if err := s.db.Exec("INSERT INTO news_tags (news_id, tag_id) VALUES (?, ?) ON CONFLICT DO NOTHING", news.ID, tid).Error; err != nil {
            return nil, err
        }
    }
    return news, nil
}

func (s *Service) Update(ctx context.Context, id uint, title, excerpt, body *string, slug *string, seoTitle, seoDesc *string, featuredKey *string, publishedAt *time.Time, tagIDs []uint) (*models.News, error) {
    var n models.News
    if err := s.db.First(&n, id).Error; err != nil { return nil, err }
    if title != nil { n.Title = *title }
    if excerpt != nil { n.Excerpt = *excerpt }
    if body != nil { n.Body = *body }
    if slug != nil { n.Slug = *slug }
    if seoTitle != nil { n.SeoTitle = *seoTitle }
    if seoDesc != nil { n.SeoDescription = *seoDesc }
    if featuredKey != nil { n.FeaturedImage = fmt.Sprintf("%s/%s", s.storage.Client.EndpointURL(), *featuredKey) }
    n.PublishedAt = publishedAt
    if err := s.db.Save(&n).Error; err != nil { return nil, err }
    // replace tags
    if len(tagIDs) > 0 {
        if err := s.db.Exec("DELETE FROM news_tags WHERE news_id = ?", id).Error; err != nil { return nil, err }
        for _, tid := range tagIDs {
            if err := s.db.Exec("INSERT INTO news_tags (news_id, tag_id) VALUES (?, ?) ON CONFLICT DO NOTHING", id, tid).Error; err != nil { return nil, err }
        }
    }
    return &n, nil
}

func (s *Service) GetBySlug(ctx context.Context, slug string) (*models.News, error) {
    var n models.News
    if err := s.db.Where("lower(slug) = lower(?)", slug).First(&n).Error; err != nil { return nil, err }
    return &n, nil
}

func (s *Service) GetByID(ctx context.Context, id uint) (*models.News, error) {
    var n models.News
    if err := s.db.First(&n, id).Error; err != nil { return nil, err }
    return &n, nil
}

func (s *Service) List(ctx context.Context, limit, offset int) ([]models.News, int64, error) {
    var list []models.News
    var total int64
    if err := s.db.Model(&models.News{}).Count(&total).Error; err != nil { return nil, 0, err }
    if err := s.db.Limit(limit).Offset(offset).Order("published_at desc, id desc").Find(&list).Error; err != nil { return nil, 0, err }
    return list, total, nil
}

func (s *Service) Delete(ctx context.Context, id uint) error {
    return s.db.Delete(&models.News{}, id).Error
}

func (s *Service) ListPublished(ctx context.Context, limit, offset int64) ([]models.News, error) {
    var list []models.News
    if err := s.db.Where("published_at IS NOT NULL AND published_at <= now()").Limit(int(limit)).Offset(int(offset)).Order("published_at desc, id desc").Find(&list).Error; err != nil { return nil, err }
    return list, nil
}

func (s *Service) DB() *gorm.DB { return s.db }


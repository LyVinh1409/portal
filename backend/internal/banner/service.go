package banner

import (
    "context"
    "fmt"
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

func (s *Service) Create(ctx context.Context, title, imageKey, link, position string, isActive bool, startAt, endAt *time.Time) (*models.Banner, error) {
    b := &models.Banner{Title: title, ImageKey: imageKey, Link: link, Position: position, IsActive: isActive, StartAt: startAt, EndAt: endAt, CreatedAt: time.Now()}
    if s.storage != nil {
        b.ImageURL = fmt.Sprintf("%s/%s", s.storage.Client.EndpointURL(), imageKey)
    } else {
        b.ImageURL = imageKey
    }
    if err := s.db.Create(b).Error; err != nil { return nil, err }
    return b, nil
}

func (s *Service) GetByID(ctx context.Context, id uint) (*models.Banner, error) {
    var b models.Banner
    if err := s.db.First(&b, id).Error; err != nil { return nil, err }
    return &b, nil
}

func (s *Service) List(ctx context.Context, limit, offset int) ([]models.Banner, int64, error) {
    var list []models.Banner
    var total int64
    if err := s.db.Model(&models.Banner{}).Count(&total).Error; err != nil { return nil, 0, err }
    if err := s.db.Limit(limit).Offset(offset).Order("id desc").Find(&list).Error; err != nil { return nil, 0, err }
    return list, total, nil
}

func (s *Service) Update(ctx context.Context, id uint, title *string, imageKey *string, link *string, position *string, isActive *bool, startAt, endAt *time.Time) (*models.Banner, error) {
    var b models.Banner
    if err := s.db.First(&b, id).Error; err != nil { return nil, err }
    if title != nil { b.Title = *title }
    if imageKey != nil { b.ImageKey = *imageKey; if s.storage != nil { b.ImageURL = fmt.Sprintf("%s/%s", s.storage.Client.EndpointURL(), *imageKey) } else { b.ImageURL = *imageKey } }
    if link != nil { b.Link = *link }
    if position != nil { b.Position = *position }
    if isActive != nil { b.IsActive = *isActive }
    b.StartAt = startAt
    b.EndAt = endAt
    if err := s.db.Save(&b).Error; err != nil { return nil, err }
    return &b, nil
}

func (s *Service) Delete(ctx context.Context, id uint) error { return s.db.Delete(&models.Banner{}, id).Error }

func (s *Service) ListActive(ctx context.Context) ([]models.Banner, error) {
    var list []models.Banner
    now := time.Now()
    if err := s.db.Where("is_active = ? AND (start_at IS NULL OR start_at <= ?) AND (end_at IS NULL OR end_at >= ?)", true, now, now).Order("position asc, id desc").Find(&list).Error; err != nil { return nil, err }
    return list, nil
}

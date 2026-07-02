package media

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

func (s *Service) RegisterMedia(ctx context.Context, key, folder, mediaType, contentType string, size int64, thumbKey *string, durationSeconds *int, metadata map[string]interface{}) (*models.Media, error) {
    url := key
    if s.storage != nil {
        url = fmt.Sprintf("%s/%s", s.storage.Client.EndpointURL(), key)
    }
    m := &models.Media{Key: key, URL: url, Folder: folder, MediaType: mediaType, ContentType: contentType, Size: size, ThumbKey: nil, PreviewURL: nil, DurationSeconds: durationSeconds, Metadata: metadata}
    if thumbKey != nil { m.ThumbKey = thumbKey; if s.storage != nil { t := fmt.Sprintf("%s/%s", s.storage.Client.EndpointURL(), *thumbKey); m.PreviewURL = &t } }
    if err := s.db.Create(m).Error; err != nil { return nil, err }
    return m, nil
}

func (s *Service) ListByFolder(ctx context.Context, folder string, limit, offset int) ([]models.Media, int64, error) {
    var list []models.Media
    var total int64
    if err := s.db.Model(&models.Media{}).Where("folder = ?", folder).Count(&total).Error; err != nil { return nil, 0, err }
    if err := s.db.Where("folder = ?", folder).Limit(limit).Offset(offset).Order("id desc").Find(&list).Error; err != nil { return nil, 0, err }
    return list, total, nil
}

func (s *Service) GetByID(ctx context.Context, id uint) (*models.Media, error) {
    var m models.Media
    if err := s.db.First(&m, id).Error; err != nil { return nil, err }
    return &m, nil
}

func (s *Service) Delete(ctx context.Context, id uint) error {
    return s.db.Delete(&models.Media{}, id).Error
}

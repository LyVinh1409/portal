package user

import (
    "context"

    "github.com/example/project/backend/internal/models"
    "gorm.io/gorm"
    "golang.org/x/crypto/bcrypt"
)

type Service struct{
    db *gorm.DB
}

func NewService(db *gorm.DB) *Service { return &Service{db: db} }

func (s *Service) Create(ctx context.Context, email, password string) (*models.User, error) {
    hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil { return nil, err }
    u := &models.User{Email: email, PasswordHash: string(hashed)}
    if err := s.db.Create(u).Error; err != nil { return nil, err }
    return u, nil
}

func (s *Service) GetByID(ctx context.Context, id uint) (*models.User, error) {
    var u models.User
    if err := s.db.First(&u, id).Error; err != nil { return nil, err }
    return &u, nil
}

func (s *Service) List(ctx context.Context, limit, offset int) ([]models.User, int64, error) {
    var users []models.User
    var total int64
    if err := s.db.Model(&models.User{}).Count(&total).Error; err != nil { return nil, 0, err }
    if err := s.db.Limit(limit).Offset(offset).Order("id desc").Find(&users).Error; err != nil { return nil, 0, err }
    return users, total, nil
}

func (s *Service) Update(ctx context.Context, id uint, email *string, password *string) (*models.User, error) {
    var u models.User
    if err := s.db.First(&u, id).Error; err != nil { return nil, err }
    if email != nil {
        u.Email = *email
    }
    if password != nil {
        hashed, err := bcrypt.GenerateFromPassword([]byte(*password), bcrypt.DefaultCost)
        if err != nil { return nil, err }
        u.PasswordHash = string(hashed)
    }
    if err := s.db.Save(&u).Error; err != nil { return nil, err }
    return &u, nil
}

func (s *Service) Delete(ctx context.Context, id uint) error {
    return s.db.Delete(&models.User{}, id).Error
}

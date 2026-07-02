package auth

import (
    "context"
    "errors"
    "time"

    "github.com/example/project/backend/internal/models"
    "golang.org/x/crypto/bcrypt"
    "gorm.io/gorm"
)

type Service struct{
    db *gorm.DB
    store *RedisStore
    jwtSecret string
    accessTTL time.Duration
    refreshTTL time.Duration
}

func NewService(db *gorm.DB, store *RedisStore, jwtSecret string) *Service {
    return &Service{db: db, store: store, jwtSecret: jwtSecret, accessTTL: time.Minute*15, refreshTTL: time.Hour*24*7}
}

func (s *Service) Login(ctx context.Context, email, password string) (accessToken, refreshToken string, user *models.User, err error) {
    var u models.User
    if err := s.db.Where("email = ?", email).First(&u).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) { return "", "", nil, errors.New("invalid") }
        return "", "", nil, err
    }
    if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password)); err != nil {
        return "", "", nil, errors.New("invalid")
    }
    at, err := GenerateToken(s.jwtSecret, u.ID, s.accessTTL)
    if err != nil { return "", "", nil, err }
    rt := randomToken()
    if err := s.store.SaveRefreshToken(ctx, u.ID, rt, s.refreshTTL); err != nil { return "", "", nil, err }
    return at, rt, &u, nil
}

func (s *Service) Refresh(ctx context.Context, userID uint, token string) (newAccess, newRefresh string, err error) {
    ok, err := s.store.ValidateRefreshToken(ctx, userID, token)
    if err != nil { return "", "", err }
    if !ok { return "", "", errors.New("invalid") }
    at, err := GenerateToken(s.jwtSecret, userID, s.accessTTL)
    if err != nil { return "", "", err }
    rt := randomToken()
    if err := s.store.SaveRefreshToken(ctx, userID, rt, s.refreshTTL); err != nil { return "", "", err }
    return at, rt, nil
}

func (s *Service) Logout(ctx context.Context, userID uint) error {
    return s.store.DeleteRefreshToken(ctx, userID)
}

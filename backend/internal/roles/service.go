package roles

import (
    "errors"
    "time"

    "github.com/example/project/backend/internal/models"
    "gorm.io/gorm"
)

type Service struct{ db *gorm.DB }

func NewService(db *gorm.DB) *Service { return &Service{db: db} }

func (s *Service) ListRoles() ([]models.Role, error) {
    var out []models.Role
    if err := s.db.Order("id asc").Find(&out).Error; err != nil { return nil, err }
    return out, nil
}

func (s *Service) CreateRole(name, desc string) (*models.Role, error) {
    r := &models.Role{Name: name, Description: desc}
    if err := s.db.Create(r).Error; err != nil { return nil, err }
    return r, nil
}

func (s *Service) UpdateRole(id uint, name, desc string) (*models.Role, error) {
    var r models.Role
    if err := s.db.First(&r, id).Error; err != nil { return nil, err }
    r.Name = name; r.Description = desc
    if err := s.db.Save(&r).Error; err != nil { return nil, err }
    return &r, nil
}

func (s *Service) DeleteRole(id uint) error {
    if err := s.db.Delete(&models.Role{}, id).Error; err != nil { return err }
    return nil
}

// Permissions
func (s *Service) ListPermissions() ([]models.Permission, error) {
    var out []models.Permission
    if err := s.db.Order("id asc").Find(&out).Error; err != nil { return nil, err }
    return out, nil
}

func (s *Service) CreatePermission(name, desc string) (*models.Permission, error) {
    p := &models.Permission{Name: name, Description: desc}
    if err := s.db.Create(p).Error; err != nil { return nil, err }
    return p, nil
}

func (s *Service) AssignPermission(roleID, permID uint) error {
    // check exists
    var r models.Role
    if err := s.db.First(&r, roleID).Error; err != nil { return err }
    var p models.Permission
    if err := s.db.First(&p, permID).Error; err != nil { return err }
    rp := models.RolePermission{RoleID: uint(roleID), PermissionID: uint(permID), CreatedAt: time.Now()}
    if err := s.db.Create(&rp).Error; err != nil { return err }
    return nil
}

func (s *Service) RevokePermission(roleID, permID uint) error {
    if err := s.db.Where("role_id = ? AND permission_id = ?", roleID, permID).Delete(&models.RolePermission{}).Error; err != nil { return err }
    return nil
}

func (s *Service) PermissionsForRole(roleID uint) ([]models.Permission, error) {
    var perms []models.Permission
    if err := s.db.Table("permissions").Select("permissions.*").Joins("join role_permissions rp on rp.permission_id = permissions.id").Where("rp.role_id = ?", roleID).Scan(&perms).Error; err != nil { return nil, err }
    return perms, nil
}

func (s *Service) EnsureDefaultRoles() error {
    // ensure admin role exists
    var r models.Role
    if err := s.db.Where("name = ?", "admin").First(&r).Error; errors.Is(err, gorm.ErrRecordNotFound) {
        _, err := s.CreateRole("admin", "Administrator role")
        return err
    }
    return nil
}

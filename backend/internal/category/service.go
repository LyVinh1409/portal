package category

import (
    "context"
    "fmt"

    "github.com/example/project/backend/internal/models"
    "gorm.io/gorm"
)

type Service struct{
    db *gorm.DB
}

func NewService(db *gorm.DB) *Service { return &Service{db: db} }

func (s *Service) Create(ctx context.Context, name, slug string, parentID *uint) (*models.Category, error) {
    cat := &models.Category{Name: name, Slug: slug, ParentID: parentID}
    if err := s.db.Create(cat).Error; err != nil {
        return nil, err
    }
    // set path
    if parentID != nil {
        var parent models.Category
        if err := s.db.First(&parent, *parentID).Error; err != nil {
            // ignore; parent may have been deleted
            cat.Path = fmt.Sprintf("%d", cat.ID)
        } else {
            cat.Path = parent.Path + "/" + fmt.Sprintf("%d", cat.ID)
        }
    } else {
        cat.Path = fmt.Sprintf("%d", cat.ID)
    }
    if err := s.db.Save(cat).Error; err != nil { return nil, err }
    return cat, nil
}

func (s *Service) GetByID(ctx context.Context, id uint) (*models.Category, error) {
    var c models.Category
    if err := s.db.First(&c, id).Error; err != nil { return nil, err }
    return &c, nil
}

func (s *Service) ListChildren(ctx context.Context, parentID *uint) ([]models.Category, error) {
    var cats []models.Category
    q := s.db.Order("id asc")
    if parentID == nil {
        q = q.Where("parent_id IS NULL")
    } else {
        q = q.Where("parent_id = ?", *parentID)
    }
    if err := q.Find(&cats).Error; err != nil { return nil, err }
    return cats, nil
}

func (s *Service) ListAll(ctx context.Context, limit, offset int) ([]models.Category, int64, error) {
    var cats []models.Category
    var total int64
    if err := s.db.Model(&models.Category{}).Count(&total).Error; err != nil { return nil, 0, err }
    if err := s.db.Limit(limit).Offset(offset).Order("path asc").Find(&cats).Error; err != nil { return nil, 0, err }
    return cats, total, nil
}

func (s *Service) Update(ctx context.Context, id uint, name *string, slug *string, parentID *uint) (*models.Category, error) {
    var c models.Category
    if err := s.db.First(&c, id).Error; err != nil { return nil, err }
    if name != nil { c.Name = *name }
    if slug != nil { c.Slug = *slug }
    if parentID != nil { c.ParentID = parentID } else { c.ParentID = nil }
    if err := s.db.Save(&c).Error; err != nil { return nil, err }
    // recompute path
    if c.ParentID != nil {
        var p models.Category
        if err := s.db.First(&p, *c.ParentID).Error; err == nil {
            c.Path = p.Path + "/" + fmt.Sprintf("%d", c.ID)
        } else {
            c.Path = fmt.Sprintf("%d", c.ID)
        }
    } else {
        c.Path = fmt.Sprintf("%d", c.ID)
    }
    if err := s.db.Save(&c).Error; err != nil { return nil, err }
    return &c, nil
}

func (s *Service) Delete(ctx context.Context, id uint) error {
    // Prevent delete if has children
    var cnt int64
    if err := s.db.Model(&models.Category{}).Where("parent_id = ?", id).Count(&cnt).Error; err != nil { return err }
    if cnt > 0 { return fmt.Errorf("has children") }
    return s.db.Delete(&models.Category{}, id).Error
}

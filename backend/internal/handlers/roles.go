package handlers

import (
    "net/http"
    "strconv"

    "github.com/example/project/backend/internal/roles"
    "github.com/gin-gonic/gin"
)

type RolesHandler struct{ svc *roles.Service }

func NewRolesHandler(svc *roles.Service) *RolesHandler { return &RolesHandler{svc: svc} }

func (h *RolesHandler) RegisterRoutes(rg *gin.RouterGroup) {
    rg.GET("/roles", h.list)
    rg.POST("/roles", h.create)
    rg.PUT("/roles/:id", h.update)
    rg.DELETE("/roles/:id", h.delete)

    rg.GET("/permissions", h.listPerms)
    rg.POST("/permissions", h.createPerm)
    rg.POST("/roles/:id/permissions", h.assignPerm)
    rg.DELETE("/roles/:id/permissions/:pid", h.revokePerm)
}

func (h *RolesHandler) list(c *gin.Context) {
    out, err := h.svc.ListRoles()
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, out)
}

func (h *RolesHandler) create(c *gin.Context) {
    var req struct{ Name, Description string }
    if err := c.BindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    r, err := h.svc.CreateRole(req.Name, req.Description)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, r)
}

func (h *RolesHandler) update(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var req struct{ Name, Description string }
    if err := c.BindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    r, err := h.svc.UpdateRole(uint(id), req.Name, req.Description)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, r)
}

func (h *RolesHandler) delete(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.svc.DeleteRole(uint(id)); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.Status(http.StatusNoContent)
}

func (h *RolesHandler) listPerms(c *gin.Context) {
    out, err := h.svc.ListPermissions()
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, out)
}

func (h *RolesHandler) createPerm(c *gin.Context) {
    var req struct{ Name, Description string }
    if err := c.BindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    p, err := h.svc.CreatePermission(req.Name, req.Description)
    if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.JSON(http.StatusOK, p)
}

func (h *RolesHandler) assignPerm(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var req struct{ PermissionID uint }
    if err := c.BindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
    if err := h.svc.AssignPermission(uint(id), req.PermissionID); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.Status(http.StatusNoContent)
}

func (h *RolesHandler) revokePerm(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    pid, _ := strconv.Atoi(c.Param("pid"))
    if err := h.svc.RevokePermission(uint(id), uint(pid)); err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
    c.Status(http.StatusNoContent)
}

package auth

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
)

func JWTMiddleware(secret string) gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error":"unauthorized"})
            return
        }
        token := strings.TrimPrefix(authHeader, "Bearer ")
        claims, err := ParseToken(secret, token)
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error":"unauthorized"})
            return
        }
        c.Set("user_id", claims.UserID)
        c.Next()
    }
}

func RequireRole(roleName string) gin.HandlerFunc {
    return func(c *gin.Context) {
        // This is a placeholder hook: role checks should query DB
        // For now, allow all (implement role lookups in production)
        c.Next()
    }
}

package main

import (
    "fmt"
    "io/fs"
    "log"
    "os"
    "path/filepath"
    "sort"

    "golang.org/x/crypto/bcrypt"

    "github.com/example/project/backend/internal/db"
    "github.com/example/project/backend/internal/models"
    "gorm.io/gorm"
)

func main() {
    // load env
    cfg := db.Config{
        Host:     getEnv("POSTGRES_HOST", "postgres"),
        Port:     getEnv("POSTGRES_PORT", "5432"),
        User:     getEnv("POSTGRES_USER", "postgres"),
        Password: getEnv("POSTGRES_PASSWORD", "postgres"),
        DBName:   getEnv("POSTGRES_DB", "appdb"),
    }

    gormDB, err := db.Connect(cfg)
    if err != nil {
        log.Fatalf("connect db: %v", err)
    }

    if err := runMigrations(gormDB, "./migrations"); err != nil {
        log.Fatalf("migrate: %v", err)
    }

    if err := runSeeds(gormDB); err != nil {
        log.Fatalf("seed: %v", err)
    }

    fmt.Println("migrations and seeds applied")
}

func getEnv(k, def string) string {
    v := os.Getenv(k)
    if v == "" {
        return def
    }
    return v
}

func runMigrations(db *gorm.DB, dir string) error {
    entries := []string{}
    err := filepath.WalkDir(dir, func(path string, d fs.DirEntry, err error) error {
        if err != nil { return err }
        if d.IsDir() { return nil }
        entries = append(entries, path)
        return nil
    })
    if err != nil { return err }

    sort.Strings(entries)

    for _, f := range entries {
        b, err := os.ReadFile(f)
        if err != nil { return err }
        if len(b) == 0 { continue }
        if err := db.Exec(string(b)).Error; err != nil { return fmt.Errorf("exec %s: %w", f, err) }
        fmt.Printf("applied %s\n", f)
    }
    return nil
}

func runSeeds(db *gorm.DB) error {
    var count int64
    if err := db.Model(&models.User{}).Count(&count).Error; err != nil {
        return err
    }
    if count > 0 { return nil }

    pw := "password"
    hash, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
    if err != nil { return err }

    user := models.User{Email: "admin@example.com", PasswordHash: string(hash)}
    if err := db.Create(&user).Error; err != nil { return err }
    fmt.Println("seeded admin@example.com / password")
    return nil
}

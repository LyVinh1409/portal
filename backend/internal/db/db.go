package db

import (
    "fmt"

    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

type Config struct {
    Host     string
    Port     string
    User     string
    Password string
    DBName   string
}

func Connect(c Config) (*gorm.DB, error) {
    dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        c.Host, c.Port, c.User, c.Password, c.DBName)
    return gorm.Open(postgres.Open(dsn), &gorm.Config{})
}

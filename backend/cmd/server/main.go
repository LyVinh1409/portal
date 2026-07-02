package main

import (
    "fmt"
    "log"
    "os"

    "github.com/example/project/backend/internal/db"
    "github.com/example/project/backend/internal/server"
)

func main() {
    cfg := server.LoadConfig()

    dbCfg := db.Config{
        Host:     cfg.DBConfig.Host,
        Port:     cfg.DBConfig.Port,
        User:     cfg.DBConfig.User,
        Password: cfg.DBConfig.Password,
        DBName:   cfg.DBConfig.DBName,
    }

    gormDB, err := db.Connect(dbCfg)
    if err != nil {
        log.Fatalf("failed connect db: %v", err)
    }

    srv := server.New(gormDB, cfg)

    addr := fmt.Sprintf(":%s", cfg.Port)
    log.Printf("listening %s", addr)
    if err := srv.Run(addr); err != nil {
        log.Fatalf("server exit: %v", err)
    }
    _ = os.Stdout
}

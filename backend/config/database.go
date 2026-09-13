package config

import (
    "fmt"
    "os"

    "obsidian-backend/models"

    "github.com/joho/godotenv"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
    err := godotenv.Load()
    if err != nil {
        fmt.Println("Warning: No .env file found, using system environment variables")
    }

    host := os.Getenv("DB_HOST")
    user := os.Getenv("DB_USER")
    password := os.Getenv("DB_PASSWORD")
    dbName := os.Getenv("DB_NAME")
    port := os.Getenv("DB_PORT")
    sslMode := os.Getenv("DB_SSLMODE")

    dsn := fmt.Sprintf(
        "host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
        host, user, password, dbName, port, sslMode,
    )

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("Failed to connect to database: " + err.Error())
    }

    fmt.Println("Database connection successfully established.")

    // تحديث الهجرة التلقائية (AutoMigrate) لتشمل جدول Review بجانب User و Product
    err = db.AutoMigrate(&models.User{}, &models.Product{}, &models.Review{})
    if err != nil {
        panic("Failed to migrate database: " + err.Error())
    }

    DB = db
}
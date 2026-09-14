package main

import (
    "os"

    "obsidian-backend/config"
    "obsidian-backend/controllers"

    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
    config.ConnectDB()

    app := fiber.New()

    // 🛑 السماح لنطاق Vercel ولـ localhost معاً بصورة صريحة
    app.Use(cors.New(cors.Config{
        AllowOrigins:     "https://opsidianx.vercel.app, http://localhost:3000",
        AllowHeaders:     "Origin, Content-Type, Accept, Authorization, X-User-Email",
        AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
        AllowCredentials: true,
    }))

    api := app.Group("/api/v1")

    api.Post("/auth/register", controllers.Register)
    api.Post("/auth/login", controllers.Login)

    api.Get("/products", controllers.GetProducts)
    api.Get("/products/:id", controllers.GetProductByID)
    api.Post("/products", controllers.CreateProduct)
    api.Post("/products/:id/reviews", controllers.AddProductReview)
    api.Delete("/products/:id", controllers.DeleteProduct)

    port := os.Getenv("PORT")
    if port == "" {
        port = "10000"
    }

    app.Listen(":" + port)
}
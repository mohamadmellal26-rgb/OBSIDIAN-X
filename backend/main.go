package main

import (
	"os"

	"obsidian-backend/config"
	"obsidian-backend/controllers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// 1. الاتصال بقاعدة البيانات وتجهيز الهجرة التلقائية
	config.ConnectDB()

	app := fiber.New()

	// قراءة Origin المسموح به من البيئة أو استخدام localhost كبديل
	clientURL := os.Getenv("CLIENT_URL")
	if clientURL == "" {
		clientURL = "http://localhost:3000"
	}

	// 2. إعداد CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins:     clientURL,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization, X-User-Email",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
	}))

	// 3. مجموعة مسارات الـ API
	api := app.Group("/api/v1")

	// مسارات التوثيق (Auth Routes)
	api.Post("/auth/register", controllers.Register)
	api.Post("/auth/login", controllers.Login)

	// مسارات المنتجات والتقييمات (Product & Reviews Routes)
	api.Get("/products", controllers.GetProducts)
	api.Get("/products/:id", controllers.GetProductByID)
	api.Post("/products", controllers.CreateProduct)
	api.Post("/products/:id/reviews", controllers.AddProductReview)
	api.Delete("/products/:id", controllers.DeleteProduct)

	// 4. تحديد المنفذ ديناميكيًا لقراءته من Render
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	app.Listen(":" + port)
}
package main

import (
    "obsidian-backend/config"
    "obsidian-backend/controllers"

    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
    // 1. الاتصال بقاعدة البيانات وتجهيز الهجرة التلقائية (تشمل User, Product, Review)
    config.ConnectDB()

    app := fiber.New()

    // 2. إعداد CORS للسماح لتطبيق Next.js بالاتصال بالسيرفر وإرسال الهيدرز المطلوبة (مثل X-User-Email)
    app.Use(cors.New(cors.Config{
        AllowOrigins:     "http://localhost:3000",
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
    api.Get("/products/:id", controllers.GetProductByID)             // جلب المنتج مع التقييمات عبر Preload
    api.Post("/products", controllers.CreateProduct)
    api.Post("/products/:id/reviews", controllers.AddProductReview) // إضافة تقييم نجومي وتعليق وتحديث المتوسط تلقائياً
    api.Delete("/products/:id", controllers.DeleteProduct)          // حذف المنتج مع التحقق من الصلاحيات

    // تشغيل السيرفر على البورت 8080
    app.Listen(":8080")
}
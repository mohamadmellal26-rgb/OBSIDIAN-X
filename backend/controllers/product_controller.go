package controllers

import (
    "obsidian-backend/config"
    "obsidian-backend/models"

    "github.com/gofiber/fiber/v2"
)

// إنشاء منتج جديد وتخزينه مع بيانات المستخدم
func CreateProduct(c *fiber.Ctx) error {
    var product models.Product
    if err := c.BodyParser(&product); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Cannot parse JSON",
        })
    }

    result := config.DB.Create(&product)
    if result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": result.Error.Error(),
        })
    }

    return c.Status(fiber.StatusCreated).JSON(product)
}

// جلب جميع المنتجات
func GetProducts(c *fiber.Ctx) error {
    var products []models.Product
    result := config.DB.Preload("Reviews").Find(&products)
    if result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to fetch products",
        })
    }

    return c.JSON(products)
}

// جلب تفاصيل المنتج مع تقييماته وتعليقاته عبر Preload (تم تعريفها مرة واحدة فقط هنا)
func GetProductByID(c *fiber.Ctx) error {
    id := c.Params("id")
    var product models.Product

    result := config.DB.Preload("Reviews").First(&product, id)
    if result.Error != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": "Product not found",
        })
    }

    return c.JSON(product)
}

// إضافة تقييم وتعليق جديد للمنتج وحساب متوسط التقييمات تلقائياً
func AddProductReview(c *fiber.Ctx) error {
    productID := c.Params("id")

    var product models.Product
    if err := config.DB.First(&product, productID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": "Product not found",
        })
    }

    var review models.Review
    if err := c.BodyParser(&review); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Cannot parse review JSON",
        })
    }

    // ربط التقييم برقم المنتج
    review.ProductID = product.ID
    
    // حفظ التقييم في قاعدة البيانات
    if err := config.DB.Create(&review).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to save review",
        })
    }

    // إعادة حساب متوسط التقييمات وعددها للمنتج وتحديثه
    var reviews []models.Review
    config.DB.Where("product_id = ?", product.ID).Find(&reviews)

    var totalRating float64
    for _, r := range reviews {
        totalRating += float64(r.Rating)
    }

    product.ReviewsCount = len(reviews)
    if product.ReviewsCount > 0 {
        product.Rating = totalRating / float64(product.ReviewsCount)
    }
    config.DB.Save(&product)

    return c.Status(fiber.StatusCreated).JSON(fiber.Map{
        "message": "Review added successfully",
        "review":  review,
    })
}

// دالة الحذف مع التحقق من أن المستخدم الحالي هو صاحب المنتج فعلياً
func DeleteProduct(c *fiber.Ctx) error {
    id := c.Params("id")
    
    // استلام بريد المستخدم المرسل من الهيدر (Headers) في الطلب
    userEmail := c.Get("X-User-Email")

    var product models.Product
    result := config.DB.First(&product, id)
    if result.Error != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": "Product not found",
        })
    }

    // التحقق الأمني: منع الحذف إذا كان المنتج مسجلاً باسم مستخدم آخر
    if product.UserEmail != "" && product.UserEmail != userEmail {
        return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
            "error": "You are not authorized to delete this product",
        })
    }

    // تنفيذ الحذف إذا تطابق الإيميل أو لم يكن له مالك محدد
    deleteResult := config.DB.Delete(&product)
    if deleteResult.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to delete product",
        })
    }

    return c.JSON(fiber.Map{
        "message": "Product deleted successfully",
    })
}
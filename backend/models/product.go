package models

import (
    "time"

    "gorm.io/gorm"
)

// نموذج التقييمات والتعليقات الخاص بالمنتجات
type Review struct {
    ID        uint           `json:"id" gorm:"primarykey"`
    CreatedAt time.Time      `json:"createdAt"`
    UpdatedAt time.Time      `json:"updatedAt"`
    DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
    ProductID uint           `json:"productId" gorm:"not null;index"`
    UserName  string         `json:"userName" gorm:"not null"`
    UserEmail string         `json:"userEmail"`
    Rating    int            `json:"rating" gorm:"not null"`
    Comment   string         `json:"comment" gorm:"type:text;not null"`
}

// نموذج المنتج مع تضمين علاقة التعليقات والتقييمات
type Product struct {
    ID            uint           `json:"id" gorm:"primarykey"`
    CreatedAt     time.Time      `json:"createdAt"`
    UpdatedAt     time.Time      `json:"updatedAt"`
    DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
    Title         string         `json:"title" gorm:"not null"`
    Price         string         `json:"price" gorm:"not null"`
    OriginalPrice string         `json:"originalPrice,omitempty"`
    Discount      string         `json:"discount,omitempty"`
    Image         string         `json:"image" gorm:"not null"`
    Images        []string       `json:"images,omitempty" gorm:"serializer:json"`
    Badge         string         `json:"badge,omitempty"`
    Rating        float64        `json:"rating,omitempty"`
    ReviewsCount  int            `json:"reviewsCount,omitempty"`
    SoldCount     int            `json:"soldCount,omitempty"`
    CategoryID    uint           `json:"categoryId" gorm:"not null"`
    UserID        uint           `json:"userId"`      // معرف المستخدم صاحب المنتج
    UserEmail     string         `json:"userEmail"`   // البريد الإلكتروني لصاحب المنتج للتحقق والصلاحيات
    
    // علاقة الربط لتمكين جلب التقييمات التابعة للمنتج تلقائياً
    Reviews       []Review       `json:"reviews,omitempty" gorm:"foreignKey:ProductID;constraint:OnDelete:CASCADE;"`
}
package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name     string `json:"name"`
	Email    string `gorm:"uniqueIndex;not null" json:"email"`
	Password string `json:"-"` // عدم إرجاع كلمة المرور في الـ JSON
}
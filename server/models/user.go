package models

// User model struct
type User struct {
	ID       int             `json:"id" gorm:"primary_key:auto_increment"`
	Fullname string          `json:"fullname" gorm:"type: varchar(255)"`
	Email    string          `json:"email" gorm:"type: varchar(255)"`
	Password string          `json:"password" gorm:"type: varchar(255)"`
	Status   string          `json:"status"`
	Profile  ProfileResponse `json:"profile"  gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type UserProfile struct {
	ID       int    `json:"id"`
	Fullname string `json:"fullname"`
	Email    string `json:"email"`
	Status   string `json:"status"`
}

func (UserProfile) TableName() string {
	return "users"
}

type UsersProfileResponse struct {
	ID       int    `json:"id"`
	Fullname string `json:"fullname"`
}

func (UsersProfileResponse) TableName() string {
	return "users"
}

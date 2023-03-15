package models

type Profile struct {
	ID      int                  `json:"id"`
	Phone   string               `json:"phone" gorm:"type: varchar(255)"`
	Gender  string               `json:"gender" gorm:"type: varchar(255)"`
	Address string               `json:"address" gorm:"type: text"`
	Image   string               `json:"image" form:"image" gorm:"type: varchar(255)"`
	UserID  int                  `json:"user_id"`
	User    UsersProfileResponse `json:"user"`
}

type ProfileResponse struct {
	ID      int    `json:"id"`
	Phone   string `json:"phone"`
	Gender  string `json:"gender"`
	Address string `json:"address"`
	UserID  int    `json:"user_id"`
}

func (ProfileResponse) TableName() string {
	return "profiles"
}

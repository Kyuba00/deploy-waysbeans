package transactiondto

type CreateTransaction struct {
	ID     int   `json:"id"`
	UserID int   `json:"user_id" form:"user_id"`
	Total  int64 `gorm:"type: int" json:"price"`
}

type UpdateTransaction struct {
	Status string `json:"status"`
	UserID int    `json:"user_id"`
	Total  int64  `json:"total"`
}

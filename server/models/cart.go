package models

type Cart struct {
	ID            int             `json:"id" gorm:"primary_key:auto_increment"`
	ProductID     int             `json:"product_id" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Product       ProductResponse `json:"product"`
	TransactionID int             `json:"transaction_id" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Transaction   Transaction     `json:"-"`
	Qty           int             `json:"qty"`
	SubAmount     int             `json:"sub_amount"`
}

type CartResponse struct {
	ID        int             `json:"id"`
	ProductID int             `json:"product_id"`
	Product   ProductResponse `json:"product"`
	SubAmount int             `json:"sub_amount"`
}

func (CartResponse) TableName() string {
	return "carts"
}

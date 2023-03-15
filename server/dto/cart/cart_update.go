package cartdto

type CartUpdate struct {
	Qty       int ` json:"qty" `
	SubAmount int ` json:"sub_amount"`
}

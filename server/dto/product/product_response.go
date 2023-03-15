package productdto

type UpdateProductRequest struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Price int    `json:"price"`
	Image string `json:"image"`
	Stock int    `json:"stock"`
	Desc  string `json:"desc"`
}

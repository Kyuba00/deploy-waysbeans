package usersdto

type UserResponse struct {
	ID       int    `json:"id"`
	Fullname  string `json:"fullname" form:"fullname" validate:"required"`
	Email    string `json:"email" form:"email" validate:"required"`
	Password string `json:"password" form:"password" validate:"required"`
	Status   string `json:"status" form:"status"`
}

type DeleteUserResponse struct {
	ID       int    `json:"id"`
	Fullname string `json:"fullname"`
}

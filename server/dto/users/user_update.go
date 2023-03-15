package usersdto

type UpdateUserRequest struct {
	Fullname  string `json:"fullname" form:"fullname"`
	Email    string `json:"email" form:"email"`
	Password string `json:"password" form:"password"`
	Status   string `json:"status" form:"status"`
}

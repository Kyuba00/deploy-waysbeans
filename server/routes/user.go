package routes

import (
	"waysbeans_be/handlers"
	"waysbeans_be/pkg/middleware"
	"waysbeans_be/pkg/mysql"
	"waysbeans_be/repositories"

	"github.com/labstack/echo/v4"
)

func UserRoutes(e *echo.Group) {
	// GET USER REPOSITORY HANDLER
	userRepository := repositories.RepositoryUser(mysql.DB)
	h := handlers.HandlerUser(userRepository)

	//DEFINE ROUTES
	e.GET("/user", h.GetUser, middleware.Auth)
	e.PATCH("/user/:id", h.UpdateUser, middleware.Auth, middleware.UploadFile) // tambahin middleware.UploadFile buat photo profile nanti

}

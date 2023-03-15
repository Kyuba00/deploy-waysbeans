package routes

import (
	"waysbeans_be/handlers"
	"waysbeans_be/pkg/middleware"
	"waysbeans_be/pkg/mysql"
	"waysbeans_be/repositories"

	"github.com/labstack/echo/v4"
)

func ProfileRoutes(e *echo.Group) {
	// GET USER REPOSITORY HANDLER
	profileRepository := repositories.RepositoryProfile(mysql.DB)
	h := handlers.HandlerUser(profileRepository)

	//DEFINE ROUTES
	e.GET("/profile", h.GetUser, middleware.Auth)
}

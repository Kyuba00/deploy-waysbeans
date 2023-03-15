package routes

import (
	"waysbeans_be/handlers"
	"waysbeans_be/pkg/middleware"
	"waysbeans_be/pkg/mysql"
	"waysbeans_be/repositories"

	"github.com/labstack/echo/v4"
)

func AuthRoutes(e *echo.Group) {
	// GET AUTH REPOSITORY HANDLER
	authRepository := repositories.RepositoryAuth(mysql.DB)
	h := handlers.HandlerAuth(authRepository)

	// DEFINE ROUTES
	e.POST("/register", h.Register)
	e.POST("/login", h.Login)
	e.GET("/auth", h.CheckAuth, middleware.Auth)
}

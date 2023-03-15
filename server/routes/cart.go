package routes

import (
	"waysbeans_be/handlers"
	"waysbeans_be/pkg/middleware"
	"waysbeans_be/pkg/mysql"
	"waysbeans_be/repositories"

	"github.com/labstack/echo/v4"
)

func CartRoutes(e *echo.Group) {
	// GET Cart REPOSITORY HANDLER
	cartRepository := repositories.RepositoryCart(mysql.DB)
	h := handlers.HandlerCart(cartRepository)

	// DEFINE ROUTES
	e.GET("/carts", h.FindCart)
	e.GET("/cart/:id", middleware.Auth(h.GetCart))
	e.POST("/cart", middleware.Auth(middleware.UploadFile(h.CreateCart)))
	// e.PATCH("/cart/:id", middleware.Auth(middleware.UploadFile(h.UpdateCart)))
	e.DELETE("/cart/:id", middleware.Auth(h.DeleteCart))
}

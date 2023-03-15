package routes

import (
	"waysbeans_be/handlers"
	"waysbeans_be/pkg/middleware"
	"waysbeans_be/pkg/mysql"
	"waysbeans_be/repositories"

	"github.com/labstack/echo/v4"
)

func ProductRoutes(e *echo.Group) {
	// GET PRODUCT REPOSITORY HANDLER
	productRepository := repositories.RepositoryProduct(mysql.DB)
	h := handlers.HandlerProduct(productRepository)

	// DEFINE ROUTES
	e.GET("/products", h.FindProducts)
	e.GET("/product/:id", middleware.Auth(h.GetProduct))
	e.POST("/product", middleware.Auth(middleware.UploadFile(h.CreateProduct)))
	e.PATCH("/product/:id", middleware.Auth(middleware.UploadFile(h.UpdateProduct)))
	e.DELETE("/product/:id", middleware.Auth(h.DeleteProduct))
}

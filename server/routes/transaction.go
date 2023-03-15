package routes

import (
	"waysbeans_be/handlers"
	"waysbeans_be/pkg/middleware"
	"waysbeans_be/pkg/mysql"
	"waysbeans_be/repositories"

	"github.com/labstack/echo/v4"
)

func TransactionRoutes(e *echo.Group) {
	transactionRepository := repositories.RepositoryTransaction(mysql.DB)
	h := handlers.HandlerTransaction(transactionRepository)

	e.GET("/transactions", h.FindTransactions, middleware.Auth)
	e.GET("/transaction-id", h.GetTransaction, middleware.Auth)
	e.POST("/transaction", h.CreateTransaction, middleware.Auth)
	e.DELETE("/transaction/:id", h.DeleteTransaction, middleware.Auth)
	e.PATCH("/transactionID", h.UpdateTransaction, middleware.Auth)
	e.POST("/notification", h.Notification)
	e.GET("/transaction-status", h.FindbyIDTransaction, middleware.Auth)
	// e.GET("/transaction1", h.AllProductById, middleware.Auth)
}

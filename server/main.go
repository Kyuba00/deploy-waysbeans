package main

import (
	"fmt"
	"waysbeans_be/database"
	"waysbeans_be/pkg/mysql"
	"waysbeans_be/routes"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	errEnv := godotenv.Load()
	if errEnv != nil {
		panic("Failed to load env file")
	}

	e := echo.New()

	mysql.DatabaseInit()
	database.RunMigration()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PATCH, echo.DELETE},
		AllowHeaders: []string{"X-Requested-With", "Content-Type", "Authorization"},
	}))

	v1 := e.Group("/api/v1")
	routes.AuthRoutes(v1)
	routes.UserRoutes(v1)
	routes.ProductRoutes(v1)
	routes.CartRoutes(v1)
	routes.TransactionRoutes(v1)

	e.Static("/uploads", "./uploads")

	fmt.Println("server running localhost:5000")
	e.Logger.Fatal(e.Start("localhost:5000"))
}

package middleware

import (
	"context"
	"net/http"
	"strings"
	dto "waysbeans_be/dto/result"
	jwtToken "waysbeans_be/pkg/jwt"

	"github.com/labstack/echo/v4"
)

type Result struct {
	Code    int         `json:"code"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}

func Auth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		token := c.Request().Header.Get("Authorization")

		if token == "" {
			return c.JSON(http.StatusUnauthorized, dto.ErrorResult{Code: http.StatusBadRequest, Message: "unauthorized"})
		}

		token = strings.Split(token, " ")[1]
		claims, err := jwtToken.DecodeToken(token)

		if err != nil {
			return c.JSON(http.StatusUnauthorized, dto.ErrorResult{Code: http.StatusBadRequest, Message: "unauthorized"})
		}

		ctx := context.WithValue(c.Request().Context(), "userInfo", claims)
		c.SetRequest(c.Request().WithContext(ctx))
		return next(c)
	}
}

package handlers

import (
	"net/http"
	"strconv"
	profiledto "waysbeans_be/dto/profile"
	dto "waysbeans_be/dto/result"
	"waysbeans_be/models"
	"waysbeans_be/repositories"

	"github.com/labstack/echo/v4"
)

type handlerProfile struct {
	ProfileRepository repositories.ProfileRepository
}

func HandlerProfile(ProfileRepository repositories.ProfileRepository) *handlerProfile {
	return &handlerProfile{ProfileRepository}
}

func (h *handlerProfile) GetProfile(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	var profile models.Profile
	profile, err := h.ProfileRepository.GetProfile(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	response := dto.SuccessResult{Code: http.StatusOK, Data: convertResponseProfile(profile)}
	return c.JSON(http.StatusOK, response)
}

func convertResponseProfile(u models.Profile) profiledto.ProfileResponse {
	return profiledto.ProfileResponse{
		ID:      u.ID,
		Phone:   u.Phone,
		Gender:  u.Gender,
		Address: u.Address,
		UserID:  u.UserID,
		User:    u.User,
	}
}

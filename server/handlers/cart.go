package handlers

import (
	"net/http"
	"strconv"
	cartdto "waysbeans_be/dto/cart"
	dto "waysbeans_be/dto/result"
	"waysbeans_be/models"
	"waysbeans_be/repositories"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerCart struct {
	CartRepository repositories.CartRepository
}

func HandlerCart(CartRepository repositories.CartRepository) *handlerCart {
	return &handlerCart{CartRepository}
}

func (h *handlerCart) FindCart(c echo.Context) error {
	carts, err := h.CartRepository.FindCarts()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: carts})
}

func (h *handlerCart) GetCart(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	cart, err := h.CartRepository.GetCart(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: cart})
}

func (h *handlerCart) CreateCart(c echo.Context) error {
	requestCart := new(cartdto.CartRequest)

	//untuk validasi bahwa data sudah dikirim atau belum
	if err := c.Bind(requestCart); err != nil {
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		return c.JSON(http.StatusBadRequest, response)
	}

	//untuk validasi untuk pengecekan keamanan
	validation := validator.New()
	err := validation.Struct(requestCart)
	if err != nil {
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		return c.JSON(http.StatusInternalServerError, response)
	}

	// get data user token
	userInfo := c.Get("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))

	//untuk pengecekan ke dalam repository
	transaction, err := h.CartRepository.GetTransactionID(userId)

	//Untuk mengakali data yang akan kita kirimkan sesuai kebutuhan. Data yang diambil berasal dari (models.Product)
	cart := models.Cart{
		Qty:           1,
		ProductID:     requestCart.ProductID,
		SubAmount:     requestCart.SubAmount,
		TransactionID: transaction.ID,
	}

	//untuk validasi untuk pengecekan keamanan
	validator := validator.New()
	err2 := validator.Struct(cart)
	if err2 != nil {
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		return c.JSON(http.StatusInternalServerError, response)
	}

	data, err := h.CartRepository.CreateCart(cart)
	if err != nil {
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		return c.JSON(http.StatusInternalServerError, response)
	}

	response := dto.SuccessResult{Code: http.StatusOK, Data: data}
	return c.JSON(http.StatusOK, response)
}

func (h *handlerCart) GetTransactionID(c echo.Context) error {
	userInfo := c.Get("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))

	cart, err := h.CartRepository.GetTransactionID(userId)
	if err != nil {
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		return c.JSON(http.StatusInternalServerError, response)
	}

	response := dto.SuccessResult{Code: http.StatusOK, Data: cart}
	return c.JSON(http.StatusOK, response)
}

func (h *handlerCart) DeleteCart(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	cart, err := h.CartRepository.GetCart(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	data, err := h.CartRepository.DeleteCart(cart, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseCart(data)})
}

func (h *handlerCart) UpdateCart(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	request := new(cartdto.CartUpdate)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	cart, err := h.CartRepository.GetCart(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if request.Qty != 0 {
		cart.Qty = request.Qty
	}

	if request.SubAmount != 0 {
		cart.SubAmount = request.SubAmount
	}

	updatedCart, err := h.CartRepository.UpdateCart(cart, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: updatedCart})
}

func convertResponseCart(u models.Cart) models.CartResponse {
	return models.CartResponse{
		ID:        u.ID,
		ProductID: u.ProductID,
		Product:   u.Product,
		SubAmount: u.SubAmount,
	}
}

package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	productdto "waysbeans_be/dto/product"
	dto "waysbeans_be/dto/result"
	"waysbeans_be/models"
	"waysbeans_be/repositories"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

var path_file = "http://localhost:5000/uploads/"

type handlerProduct struct {
	ProductRepository repositories.ProductRepository
}

func HandlerProduct(ProductRepository repositories.ProductRepository) *handlerProduct {
	return &handlerProduct{ProductRepository}
}

func (h *handlerProduct) FindProducts(c echo.Context) error {
	products, err := h.ProductRepository.FindProducts()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	for i, p := range products {
		products[i].Image = path_file + p.Image
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: products})
}

func (h *handlerProduct) GetProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	product, err := h.ProductRepository.GetProduct(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	product.Image = path_file + product.Image

	response := dto.SuccessResult{Code: http.StatusOK, Data: convertResponseProduct(product)}
	return c.JSON(http.StatusOK, response)
}

func (h *handlerProduct) CreateProduct(c echo.Context) error {
	dataFile := c.Get("dataFile").(string)

	fmt.Println(dataFile)

	price, _ := strconv.Atoi(c.FormValue("price"))
	stock, _ := strconv.Atoi(c.FormValue("stock"))

	request := productdto.CreateProductRequest{
		Name:  c.FormValue("name"),
		Desc:  c.FormValue("desc"),
		Price: price,
		Stock: stock,
		Image: dataFile,
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	product := models.Product{
		Name:  request.Name,
		Price: request.Price,
		Stock: request.Stock,
		Image: request.Image,
		Desc:  request.Desc,
	}

	product, err = h.ProductRepository.CreateProduct(product)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	product, _ = h.ProductRepository.GetProduct(product.ID)

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: product})
}

func (h *handlerProduct) UpdateProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	dataFile := c.Get("dataFile").(string)

	price, _ := strconv.Atoi(c.FormValue("price"))
	stock, _ := strconv.Atoi(c.FormValue("stock"))
	request := productdto.UpdateProductRequest{
		Name:  c.FormValue("name"),
		Price: price,
		Image: dataFile,
		Stock: stock,
		Desc:  c.FormValue("desc"),
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	product, err := h.ProductRepository.GetProduct(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if request.Name != "" {
		product.Name = request.Name
	}

	if request.Price != 0 {
		product.Price = request.Price
	}

	if dataFile != "false" {
		product.Image = request.Image
	}

	if request.Stock != 0 {
		product.Stock = request.Stock
	}

	if request.Desc != "" {
		product.Desc = request.Desc
	}

	data, err := h.ProductRepository.UpdateProduct(product, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	response := dto.SuccessResult{Code: http.StatusOK, Data: convertResponseProduct(data)}
	return c.JSON(http.StatusOK, response)
}

func (h *handlerProduct) DeleteProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	product, err := h.ProductRepository.GetProduct(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	data, err := h.ProductRepository.DeleteProduct(product)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseProduct(data)})
}

func convertResponseProduct(p models.Product) models.ProductResponse {
	return models.ProductResponse{
		ID:    p.ID,
		Name:  p.Name,
		Price: p.Price,
		Image: p.Image,
		Stock: p.Stock,
		Desc:  p.Desc,
	}
}

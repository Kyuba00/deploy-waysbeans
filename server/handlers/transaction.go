package handlers

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	dto "waysbeans_be/dto/result"
	transactiondto "waysbeans_be/dto/transaction"
	"waysbeans_be/models"
	"waysbeans_be/repositories"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/coreapi"
	"github.com/midtrans/midtrans-go/snap"
	"gopkg.in/gomail.v2"
)

var c = coreapi.Client{
	ServerKey: os.Getenv("SERVER_KEY"),
	ClientKey: os.Getenv("CLIENT_KEY"),
}

type handlerTransaction struct {
	TransactionRepository repositories.TransactionRepository
}

func HandlerTransaction(TransactionRepository repositories.TransactionRepository) *handlerTransaction {
	return &handlerTransaction{TransactionRepository}
}

func (h *handlerTransaction) FindTransactions(c echo.Context) error {
	transactions, err := h.TransactionRepository.FindTransactions()
	if err != nil {
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		return c.JSON(http.StatusBadRequest, response)
	}

	response := dto.SuccessResult{Code: http.StatusOK, Data: transactions}
	return c.JSON(http.StatusOK, response)
}

func (h *handlerTransaction) GetTransaction(c echo.Context) error {
	userInfo := c.Get("userInfo").(jwt.MapClaims)
	transId := int(userInfo["id"].(float64))

	// transId, _ := strconv.Atoi(c.Param("id"))
	transaction, err := h.TransactionRepository.GetTransaction(transId)
	if err != nil {
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		return c.JSON(http.StatusBadRequest, response)
	}

	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	return c.JSON(http.StatusOK, response)
}

func (h *handlerTransaction) CreateTransaction(c echo.Context) error {
	userInfo := c.Get("userInfo").(jwt.MapClaims)
	idUser := int(userInfo["id"].(float64))

	request := new(transactiondto.CreateTransaction)
	if err := c.Bind(request); err != nil {
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		return c.JSON(http.StatusBadRequest, response)
	}

	validate := validator.New()
	err := validate.Struct(request)
	if err != nil {
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		return c.JSON(http.StatusBadRequest, response)
	}

	//Untuk menemukan id uniq secara acak. SUDAH MASUK MATERI PAYMENT GATEWAY(MIDTRANS)
	var TransIdIsMatch = false
	var TransactionId int
	for !TransIdIsMatch {
		TransactionId = idUser + rand.Intn(10000) - rand.Intn(100)
		transactionData, _ := h.TransactionRepository.GetTransaction(TransactionId)
		if transactionData.ID == 0 {
			TransIdIsMatch = true
		}
	}

	transaction := models.Transaction{
		ID:     TransactionId,
		UserID: idUser,
		Status: "active",
	}

	statusCheck, _ := h.TransactionRepository.FindbyIDTransaction(idUser, "active")
	if statusCheck.Status == "active" {
		response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
		return c.JSON(http.StatusOK, response)
	} else {
		data, _ := h.TransactionRepository.CreateTransaction(transaction)
		response := dto.SuccessResult{Code: http.StatusOK, Data: data}
		return c.JSON(http.StatusOK, response)
	}
}

func (h *handlerTransaction) DeleteTransaction(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	transaction, err := h.TransactionRepository.GetTransaction(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	data, err := h.TransactionRepository.DeleteTransaction(transaction)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: 200, Data: data})
}

func (h *handlerTransaction) UpdateTransaction(c echo.Context) error {
	userInfo := c.Get("userInfo").(jwt.MapClaims)
	idTrans := int(userInfo["id"].(float64))

	request := new(transactiondto.UpdateTransaction)
	if err := c.Bind(request); err != nil {
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		return c.JSON(http.StatusBadRequest, response)
	}

	transaction, err := h.TransactionRepository.FindbyIDTransaction(idTrans, "active")
	if err != nil {
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		return c.JSON(http.StatusInternalServerError, response)
	}

	if request.UserID != 0 {
		transaction.UserID = request.UserID
	}

	if request.Total != 0 {
		transaction.Total = request.Total
	}

	if request.Status != "active" {
		transaction.Status = request.Status
	}

	dataTransactions, err := h.TransactionRepository.UpdateTransaction(transaction)
	if err != nil {
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		return c.JSON(http.StatusInternalServerError, response)
	}

	// 1. Initiate Snap client
	s := snap.Client{}
	s.New(os.Getenv("SERVER_KEY"), midtrans.Sandbox)
	// Use to midtrans.Production if you want Production Environment (accept real transaction).

	// 2. Initiate Snap request param
	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  strconv.Itoa(dataTransactions.ID),
			GrossAmt: int64(dataTransactions.Total), //Price
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: dataTransactions.User.Fullname, //Buyer
			Email: dataTransactions.User.Email,    //Buyer
		},
	}

	// 3. Execute request create Snap transaction to Midtrans Snap API
	snapResp, _ := s.CreateTransaction(req)

	response := dto.SuccessResult{Code: http.StatusOK, Data: snapResp}
	return c.JSON(http.StatusOK, response)
}

func (h *handlerTransaction) FindbyIDTransaction(c echo.Context) error {
	userInfo := c.Get("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))
	transaction, err := h.TransactionRepository.FindbyIDTransaction(userId, "active")
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: transaction})
}

func (h *handlerTransaction) Notification(c echo.Context) error {
	var notificationPayload map[string]interface{}

	err := c.Bind(&notificationPayload)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	transactionStatus := notificationPayload["transaction_status"].(string)
	fraudStatus := notificationPayload["fraud_status"].(string)
	orderId := notificationPayload["order_id"].(string)
	transaction, _ := h.TransactionRepository.GetOneTransaction(orderId)

	if transactionStatus == "capture" {
		if fraudStatus == "challenge" {
			h.TransactionRepository.UpdateTransactions("pending", orderId)
		} else if fraudStatus == "accept" {
			SendMail("success", transaction)
			h.TransactionRepository.UpdateTransactions("success", orderId)
		}
	} else if transactionStatus == "settlement" {
		SendMail("success", transaction)
		h.TransactionRepository.UpdateTransactions("success", orderId)
	} else if transactionStatus == "deny" {
		SendMail("failed", transaction)
		h.TransactionRepository.UpdateTransactions("failed", orderId)
	} else if transactionStatus == "cancel" || transactionStatus == "expire" {
		SendMail("failed", transaction)
		h.TransactionRepository.UpdateTransactions("failed", orderId)
	} else if transactionStatus == "pending" {
		h.TransactionRepository.UpdateTransactions("pending", orderId)
	}

	return c.JSON(http.StatusOK, nil)
}

func SendMail(status string, transaction models.Transaction) {

	if status != transaction.Status && (status == "success") {
		var CONFIG_SMTP_HOST = "smtp.gmail.com"
		var CONFIG_SMTP_PORT = 587
		var CONFIG_SENDER_NAME = "WaysBeans <akanime1@gmail.com>"
		var CONFIG_AUTH_EMAIL = os.Getenv("EMAIL_SYSTEM")
		var CONFIG_AUTH_PASSWORD = os.Getenv("PASSWORD_SYSTEM")

		var productName = transaction.User.Fullname
		var price = strconv.Itoa(int(transaction.Total))

		mailer := gomail.NewMessage()
		mailer.SetHeader("From", CONFIG_SENDER_NAME)
		mailer.SetHeader("To", transaction.User.Email)
		mailer.SetHeader("Subject", "Transaction Status")
		mailer.SetBody("text/html", fmt.Sprintf(`<!DOCTYPE html>
	  <html lang="en">
		<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
		<style>
		  h1 {
		  color: brown;
		  }
		</style>
		</head>
		<body>
		<h2>Product payment :</h2>
		<ul style="list-style-type:none;">
		  <li>Name : %s</li>
		  <li>Total payment: Rp.%s</li>
		  <li>Status : <b>%s</b></li>
		</ul>
		</body>
	  </html>`, productName, price, status))

		dialer := gomail.NewDialer(
			CONFIG_SMTP_HOST,
			CONFIG_SMTP_PORT,
			CONFIG_AUTH_EMAIL,
			CONFIG_AUTH_PASSWORD,
		)

		err := dialer.DialAndSend(mailer)
		if err != nil {
			log.Fatal(err.Error())
		}

		log.Println("Mail sent! to " + transaction.User.Email)
	}
}

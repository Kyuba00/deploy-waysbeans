package repositories

import (
	"fmt"
	"waysbeans_be/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	FindTransactions() ([]models.Transaction, error)
	GetTransaction(ID int) (models.Transaction, error)
	CreateTransaction(transaction models.Transaction) (models.Transaction, error)
	DeleteTransaction(transaction models.Transaction) (models.Transaction, error)
	UpdateTransaction(transaction models.Transaction) (models.Transaction, error)
	UpdateTransactions(status string, ID string) error                                // payment gateway (midtrans)
	FindbyIDTransaction(TransactionId int, Status string) (models.Transaction, error) // payment gateway (midtrans)
	GetOneTransaction(ID string) (models.Transaction, error)                          // payment gateway (midtrans)
	AllProductById(UserID int) ([]models.Transaction, error)                          // payment gateway (midtrans)
}

func RepositoryTransaction(db *gorm.DB) *repository {
	return &repository{db}
}
func (r *repository) FindTransactions() ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := r.db.Preload("User").Preload("Carts").Preload("Carts.Product").Find(&transactions).Error
	return transactions, err
}

func (r *repository) GetTransaction(ID int) (models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.Preload("User").Preload("Carts").Preload("Carts.Product").Find(&transaction, ID).Error
	return transaction, err
}

func (r *repository) CreateTransaction(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Create(&transaction).Error

	return transaction, err
}

func (r *repository) UpdateTransaction(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Save(&transaction).Error

	return transaction, err
}

func (r *repository) DeleteTransaction(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Delete(&transaction).Error

	return transaction, err
}

func (r *repository) UpdateTransactions(status string, ID string) error {
	var transaction models.Transaction
	r.db.Preload("Product").First(&transaction, ID)

	// If is different & Status is "success" decrement product quantity
	if status != transaction.Status && status == "success" {
		var product models.Product
		r.db.First(&product, transaction.ID)
		// product.Qty = product.Qty - 1
		r.db.Save(&product)
	}

	transaction.Status = status

	err := r.db.Save(&transaction).Error

	return err
}

func (r *repository) FindbyIDTransaction(TransactionId int, Status string) (models.Transaction, error) {
	var transaction models.Transaction
	fmt.Println(TransactionId, Status)
	err := r.db.Preload("User").Preload("Carts").Preload("Carts.Product").Where("user_id = ? AND status = ?", TransactionId, Status).First(&transaction).Error

	return transaction, err
}

func (r *repository) GetOneTransaction(ID string) (models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.Preload("Product").Preload("Product.User").Preload("Buyer").Preload("Seller").First(&transaction, "id = ?", ID).Error

	return transaction, err
}

func (r *repository) AllProductById(UserID int) ([]models.Transaction, error) {
	var transaction []models.Transaction
	err := r.db.Preload("User").Preload("Carts").Preload("Carts.Product").Find(&transaction, "user_id = ?", UserID).Error

	return transaction, err
}

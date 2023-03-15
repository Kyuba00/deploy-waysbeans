import React from "react";
import { Card, Modal } from "react-bootstrap";
import rupiahFormat from "rupiah-format";

// utilities
import UpperCase from "../../utils/UpperCase";

export default function PopupAdmin({ show, setShow, item }) {
  // setup handle close modal
  function handleClose() {
    setShow(false);
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <Modal.Title className="color-main text-center">
          Product Purchased
        </Modal.Title>
      </Modal.Body>
      <Modal.Body className="d-flex flex-column">
        {item?.map((e, i) => (
          <Card
            key={i}
            className="d-flex flex-column flex-md-row align-items-center border-0"
          >
            <Card.Img
              src={e.product.image}
              className="img-cart rounded-0 p-2"
            />
            <Card.Body className="py-1">
              <Card.Title className="my-1 color-main fw-bold">
                {UpperCase(e.product.name)} Beans
              </Card.Title>
              <Card.Text className="my-1 fs-7">
                Price : {rupiahFormat.convert(e.product.price)}
              </Card.Text>
              <Card.Text className="my-1 fs-7">
                Quantity : {e.orderQuantity} Pcs
              </Card.Text>
              <Card.Text className="my-1 fs-7">
                Subtotal :{" "}
                {rupiahFormat.convert(e.orderQuantity * e.product.price)}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </Modal.Body>
    </Modal>
  );
}

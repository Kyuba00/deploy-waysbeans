import React from "react";
import { Modal } from "react-bootstrap";

export default function PopupProduct({ show, setShow, title, color }) {
  // setup handle close modal
  function handleClose() {
    setShow(false);
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Body>
        <p style={{ color: color }} className="text-center m-0 p-3 fs-5">
          {title}
        </p>
      </Modal.Body>
    </Modal>
  );
}

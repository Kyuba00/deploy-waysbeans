import React from "react";
import { Modal } from "react-bootstrap";

export default function PopupTransaction({ show, setShow }) {
  // setup handle close modal
  function handleClose() {
    setShow(false);
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Body>
        <p style={{ color: "#469F74" }} className="text-center m-0 p-3 fs-5">
          Thank you for ordering in us, please wait to verify you order
        </p>
      </Modal.Body>
    </Modal>
  );
}

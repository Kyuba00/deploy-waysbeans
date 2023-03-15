import React from "react";
import { Button, Col, Modal } from "react-bootstrap";

export default function PopupConfirm({
  show,
  target,
  setShow,
  setTarget,
  setDelete,
}) {
  // setup handle close modal
  function handleClose() {
    setShow(false);
  }
  // setup handle delete target
  function handleDelete() {
    setDelete(target);
    setShow(false);
    setTarget(0);
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Body className="text-center">
        <p className="fs-5">Are you sure you want to delete ? </p>
        <Col className="d-flex gap-3 justify-content-center">
          <Button onClick={handleDelete} variant="danger">
            Delete
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Col>
      </Modal.Body>
    </Modal>
  );
}

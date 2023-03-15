import React, { useContext, useState } from "react";
import { Alert, Button, FloatingLabel, Form, Modal } from "react-bootstrap";
// API
import { API } from "../../configs/api";
// contexts
import { UserContext } from "../../contexts/UserContext";

export default function Login({ show, setShow, setShowRegister }) {
  const [state, dispatch] = useContext(UserContext);
  // setup state error text
  const [error, setError] = useState("");
  // setup handle close modal
  function handleClose() {
    setShow(false);
    setError("");
  }
  // setup handle switch modal
  function changeModal() {
    handleClose();
    setShowRegister(true);
  }
  // setup form login
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  // setup form login on change
  function handleOnChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  }
  // post form login on submit
  async function handleOnSubmit(e) {
    try {
      e.preventDefault();
      // get response from login
      const response = await API.post("/login", form);
      // dispatch status
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.data,
      });
      handleClose();
    } catch (error) {
      // change state error text
      setError("Wrong Email or Password");
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form className="p-5" onSubmit={handleOnSubmit}>
        <h2 className="text-left color-main fw-bold">Login</h2>
        {error !== "" ? (
          <>
            <Alert
              variant="danger"
              className="text-center"
              onClose={() => setError("")}
              dismissible
            >
              {error}
            </Alert>
          </>
        ) : (
          <></>
        )}
        <Form.Group className="my-3">
          <FloatingLabel label="Email">
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleOnChange}
              required
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Password">
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleOnChange}
              required
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group>
          <Button className="btn btn-form btn-main col-12" type="submit">
            Login
          </Button>
        </Form.Group>
        <Form.Group>
          <p className="text-center my-3">
            Don't have an account? Click{" "}
            <span className="fw-bold cursor-pointer" onClick={changeModal}>
              Here
            </span>
          </p>
        </Form.Group>
      </Form>
    </Modal>
  );
}

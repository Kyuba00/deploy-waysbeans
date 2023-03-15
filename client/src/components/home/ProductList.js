import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import rupiahFormat from "rupiah-format";
// components
import Login from "../auth/Login";
import Register from "../auth/Register";
// utitlities
import UpperCase from "../../utils/UpperCase";

export default function ProductList({ state, data }) {
  const navigate = useNavigate();
  // setup state auth form
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Container className="my-5">
      <Row className="my-3 d-flex justify-content-start">
        {data?.map((item, index) => (
          <Col key={index} sm={12} md={6} lg={4} xl={3} className="my-3">
            <Card
              className="cursor-pointer"
              onClick={() =>
                state.isLogin === false
                  ? setShowLogin(true)
                  : navigate(`/product/${item.id}`)
              }
            >
              <Card.Img src={item.image} variant="top" className="img-card" />
              <Card.Body>
                <Card.Title className="fw-bold fs-5">
                  {UpperCase(item.name)} Beans
                </Card.Title>
                <Card.Subtitle className="my-2 fs-6">
                  {rupiahFormat.convert(item.price)}
                </Card.Subtitle>
                <Card.Subtitle className="my-2 fs-6">
                  Stock: {item.stock}
                </Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Login
        show={showLogin}
        setShow={setShowLogin}
        setShowRegister={setShowRegister}
      />
      <Register
        show={showRegister}
        setShow={setShowRegister}
        setShowRegister={setShowLogin}
      />
    </Container>
  );
}

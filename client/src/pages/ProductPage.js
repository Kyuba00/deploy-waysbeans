import React, { useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import rupiahFormat from "rupiah-format";
// API
import { API } from "../configs/api";
// components
import Popup from "../components/popup/Popup";
// utilities
import UpperCase from "../utils/UpperCase";

export default function ProductPage() {
  document.title = "Waysbeans | Product";
  const navigate = useNavigate("/");
  // get parameter product id
  const { id } = useParams();
  // setup state popup
  const [show, setShow] = useState(false);
  // setup state error
  const [alert, setAlert] = useState("");
  const [title, setTitle] = useState("");
  // get product by id
  const { data: product } = useQuery("productCache", async () => {
    const response = await API.get("/product/" + id);
    return response.data.data;
  });
  // setup form cart
  const [form, setForm] = useState({
    id: parseInt(id),
    orderQuantity: "1",
  });
  // setup form cart on change
  function handleOnChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }
  // setup form cart on submit
  async function handleOnSubmit(e) {
    try {
      e.preventDefault();
      // change data type to int
      const data = {
        id: form.id,
        orderQuantity: parseInt(form.orderQuantity),
      };
      // get response from cart
      const response = await API.post("/cart", data);
      // set popup when response success
      if (response.status === 200) {
        setShow(true);
        setTitle("Success Add Product to Cart");
        setAlert("#469F74");
        setTimeout(() => {
          setShow(false);
          navigate(0);
        }, 2000);
      }
    } catch (error) {
      // set popup when response failed
      setShow(true);
      setTitle("Add Product Failed");
      setAlert("#DC3545");
      setTimeout(() => {
        setShow(false);
      }, 2000);
    }
  }

  return (
    <Container>
      <Row className="p-5 gap-3">
        <Col md={12} lg={5}>
          <Image src={product?.image} className="img-detail rounded" />
        </Col>
        <Row as={Col} md={12} lg={7} className="d-flex flex-column gap-3">
          <Col xs={12}>
            <h1 className="fw-bold color-main">
              {UpperCase(product?.name)} Beans
            </h1>
            <p className="fw-bold fs-5 color-main">
              {rupiahFormat.convert(product?.price)}
            </p>
            <p className="fw-semibold color-main">Stock: {product?.stock}</p>
          </Col>
          <Col xs={12}>
            <p className="text-justify">{product?.desc}</p>
          </Col>
          <Col>
            <Form
              className="d-flex flex-row align-items-center gap-3"
              onSubmit={handleOnSubmit}
            >
              <Form.Group
                as={Col}
                xs={8}
                className="my-3 d-flex flex-row gap-2"
              >
                <Form.Label column as={Col}>
                  Quantity :
                </Form.Label>
                <Form.Control
                  defaultValue={1}
                  type="number"
                  min={1}
                  max={product?.stock}
                  className="input-qty"
                  name="orderQuantity"
                  onChange={handleOnChange}
                />
              </Form.Group>
              <Form.Group as={Col} xs={4}>
                <Button className="btn btn-main col-12" type="submit">
                  Add
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Row>
      <Popup show={show} setShow={setShow} title={title} color={alert} />
    </Container>
  );
}

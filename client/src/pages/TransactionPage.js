import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FloatingLabel,
  Image,
  Row,
} from "react-bootstrap";
import rupiahFormat from "rupiah-format";
import { useMutation, useQuery } from "react-query";
// API
import { API } from "../configs/api";
// assets
import iconDelete from "../assets/icons/icon_trash.svg";
// components
import Popup from "../components/popup/Popup";
import PopupConfirm from "../components/popup/PopupConfirm";
import PopupTransaction from "../components/popup/PopupTransaction";
// utilities
import UpperCase from "../utils/UpperCase";
import { useNavigate } from "react-router-dom";

export default function TransactionPage() {
  document.title = "Waysbeans | Transaction";
  const navigate = useNavigate("/");
  // setup state error
  const [alert, setAlert] = useState("");
  const [title, setTitle] = useState("");
  // setup state popup
  const [show, setShow] = useState(false);
  // setup state popup confirm action
  const [showDelete, setShowDelete] = useState(false);
  // setup state target action
  const [cartTarget, setCartTarget] = useState();
  // setup state popup transaction
  const [showTransaction, setShowTransaction] = useState(false);
  // setup state visibilty form transaction
  const [switchForm, setSwitchForm] = useState(false);
  // get cart data
  const { data: cart, refetch } = useQuery("cartCache", async () => {
    const response = await API.get("/cart");
    return response.data.data;
  });
  // get current user data
  const { data: profile } = useQuery("profileCache", async () => {
    const response = await API.get("/profile");
    return response.data.data;
  });
  // setup total and quantity cart
  let total = 0;
  let quantity = 0;
  if (!!cart !== false) {
    cart?.forEach((e) => {
      total += e.subtotal;
      quantity += e.orderQuantity;
    });
  }
  // setup handle delete cart item
  async function handleDelete(id) {
    await API.delete("/cart/" + id);
    refetch();
  }
  // setup form transaction
  const [form, setForm] = useState({
    fullname: profile?.fullname,
    email: profile?.email,
    phone: profile?.phone,
    address: profile?.address,
    total: total,
  });
  // setup form transaction on change
  function handleOnChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }
  // setup form transaction on submit
  const handleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      // get response from transaction
      const response = await API.patch("/transaction", form);
      // get token from response
      const token = response.data.data.token;
      // midtrans snap
      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          // set popup when response success
          setShow(true);
          setTitle(result);
          setAlert("#469F74");
          setTimeout(() => {
            setShow(false);
            navigate("/profile");
          }, 2000);
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          // set popup when response pending
          setShow(true);
          setTitle(result);
          setAlert("#469F74");
          setTimeout(() => {
            setShow(false);
            navigate("/profile");
          }, 2000);
        },
        onError: function (result) {
          /* You may add your own implementation here */
          // set popup when response error
          setShow(true);
          setTitle(result);
          setAlert("#DC3545");
          setTimeout(() => {
            setShow(false);
          }, 2000);
        },
        onClose: function () {
          /* You may add your own implementation here */
          // set popup when close midtrans payment
          setShow(true);
          setTitle("you closed the popup without finishing the payment");
          setAlert("#DC3545");
          setTimeout(() => {
            setShow(false);
          }, 2000);
        },
      });
    } catch (error) {
      // set popup when response failed
      setShow(true);
      setTitle("Payment Failed, Try Again Later");
      setAlert("#DC3545");
      setTimeout(() => {
        setShow(false);
      }, 2000);
    }
  });
  // midtrans default
  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <Container>
      <Row className="mx-sm-2 mx-md-2 mx-lg-5 my-5">
        <Col xs={12} className="my-2">
          <Col className="mb-4">
            <h2 className="fw-bold color-main">My Cart</h2>
          </Col>
          <Col>
            <p className="fw-semibold color-main">Review Your Order</p>
            <hr className="hr-cart" />
          </Col>
          <Col sm={12} className="d-flex flex-column gap-2 px-2">
            {cart?.map((element, index) => (
              <Card
                key={index}
                className="d-flex flex-row col-12 gap-2 card-cart py-1"
              >
                <Col xs={3} md={2} className="p-0">
                  <Image
                    src={element.product.image}
                    className="rounded img-cart"
                  />
                </Col>
                <Col xs={7} md={8} className="p-0 d-flex flex-column">
                  <h6 className="fw-bold color-main fs-6">
                    {UpperCase(element.product.name)} Beans
                  </h6>
                  <p className="color-main fs-7">
                    Quantity : {element.orderQuantity} Pcs
                  </p>
                  <p className="color-main fs-7">
                    {rupiahFormat.convert(element.product.price)}
                  </p>
                </Col>
                <Col
                  xs={2}
                  className="p-0 d-flex flex-column align-items-center"
                >
                  <Button
                    className="btn-delete"
                    onClick={() => {
                      setShowDelete(true);
                      setCartTarget(element.id);
                    }}
                  >
                    <Image src={iconDelete} />
                  </Button>
                </Col>
              </Card>
            ))}
          </Col>
          <Col>
            <hr className="hr-cart" />
          </Col>
        </Col>
        <Col xs={12} className="my-2">
          <Col className="mb-4">
            <h2 className="fw-bold color-main">Payment</h2>
          </Col>
          <Col>
            <p className="fw-semibold color-main">
              Please check before payment
            </p>
            <hr className="hr-cart" />
          </Col>
          <Col className="d-flex flex-column">
            <p className="fw-bold color-main">
              Total :{" "}
              <span className="float-end">{rupiahFormat.convert(total)}</span>
            </p>
            <p className="fw-bold color-main">
              Quantity : <span className="float-end">{quantity} Pcs</span>
            </p>
          </Col>
          <Col>
            <Form onSubmit={(e) => handleOnSubmit.mutate(e)}>
              <Form.Group className="my-3">
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Other Address"
                  onChange={() => {
                    setSwitchForm(!switchForm);
                  }}
                />
              </Form.Group>
              {switchForm === true ||
              form.phone === "" ||
              form.address === "" ? (
                <>
                  <Form.Group className="my-3">
                    <FloatingLabel label="Name">
                      <Form.Control
                        type="name"
                        placeholder="Name"
                        name="name"
                        value={form.name}
                        disabled
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group className="my-3">
                    <FloatingLabel label="Email">
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={form.email}
                        disabled
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group className="my-3">
                    <FloatingLabel label="Phone">
                      <Form.Control
                        type="tel"
                        placeholder="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleOnChange}
                        required
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group className="my-3">
                    <FloatingLabel label="Address">
                      <Form.Control
                        as="textarea"
                        placeholder="address"
                        name="address"
                        value={form.address}
                        style={{ height: "150px", resize: "none" }}
                        onChange={handleOnChange}
                        required
                      />
                    </FloatingLabel>
                  </Form.Group>
                </>
              ) : (
                <></>
              )}
              <Form.Group>
                <Button className="btn btn-form btn-main col-12" type="submit">
                  Pay
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Col>
      </Row>
      <Popup show={show} setShow={setShow} title={title} color={alert} />
      <PopupConfirm
        show={showDelete}
        target={cartTarget}
        setShow={setShowDelete}
        setTarget={setCartTarget}
        setDelete={handleDelete}
      />
      <PopupTransaction show={showTransaction} setShow={setShowTransaction} />
    </Container>
  );
}

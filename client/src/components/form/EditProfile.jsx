import React, { useState } from "react";
import {
  Button,
  Col,
  FloatingLabel,
  Form,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import { useMutation } from "react-query";
// API
import { API } from "../../configs/api";
// components
import Popup from "../popup/Popup";

export default function EditProfile({ show, setShow, user, refetch }) {
  // setup state popup
  const [showPopup, setShowPopup] = useState(false);
  // setup state error
  const [alert, setAlert] = useState("");
  const [title, setTitle] = useState("");
  // setup handle close form
  function handleClose() {
    setShow(false);
  }
  // setup form edit profile
  const [form, setForm] = useState({
    fullname: user?.fullname,
    email: user?.email,
    password: "",
    phone: user?.phone,
    address: user?.address,
    image: "",
  });
  // setup profile picture preview
  const [preview, setPreview] = useState(user?.image);
  // setup handle on change form
  function handleOnChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });
    // create temporary url for preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  }
  // setup handle on submit form
  const handleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      // configuration
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // convert to form-data
      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("email", form.email);
      formData.append("image", form?.image[0] || "");
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      // get response from user
      const response = await API.patch("/user/:id", formData, config);
      // set popup when response success
      if (response.status === 200) {
        setShowPopup(true);
        setTitle("Success Update Profile");
        setAlert("#469F74");
        setTimeout(() => {
          setShowPopup(false);
          handleClose();
          refetch();
        }, 2000);
      }
    } catch (error) {
      // set popup when response failed
      setShowPopup(true);
      setTitle("Failed Update Profile");
      setAlert("#DC3545");
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    }
  });

  return (
    <Modal show={show} onHide={handleClose} scrollable>
      <Modal.Body className="p-5">
        <Form onSubmit={(e) => handleOnSubmit.mutate(e)}>
          <h2 className="text-left color-main fw-bold">Edit Profile</h2>
          <Row>
            <Col xs={12}>
              <Form.Group className="my-2">
                <FloatingLabel label="Fullname">
                  <Form.Control
                    type="text"
                    placeholder="Fullname"
                    name="fullname"
                    onChange={handleOnChange}
                    value={form.fullname}
                    required
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="my-2">
                <FloatingLabel label="Email">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleOnChange}
                    value={form.email}
                    disabled
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="my-2">
                <FloatingLabel label="Password">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleOnChange}
                    value={form.password}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="my-2">
                <FloatingLabel label="Phone">
                  <Form.Control
                    type="tel"
                    placeholder="phone"
                    name="phone"
                    onChange={handleOnChange}
                    value={form.phone}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="my-2">
                <FloatingLabel label="Address">
                  <Form.Control
                    as="textarea"
                    placeholder="address"
                    name="address"
                    onChange={handleOnChange}
                    value={form.address}
                    style={{ height: "100px", resize: "none" }}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group controlId="formFile" className="my-2">
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleOnChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} className="my-2 d-flex justify-content-center">
              <Image src={preview} className="profile-img rounded" />
            </Col>
          </Row>
          <Form.Group className=" d-flex flex-row gap-2 justify-content-center">
            <Button className="col-5 btn-main" type="submit">
              Save
            </Button>
            <Button
              className="col-5"
              variant="danger"
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Popup
        show={showPopup}
        setShow={setShowPopup}
        title={title}
        color={alert}
      />
    </Modal>
  );
}

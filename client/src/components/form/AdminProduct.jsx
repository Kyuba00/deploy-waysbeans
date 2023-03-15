import React, { useEffect, useState } from "react";
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
// components/modal
import Popup from "../popup/Popup";

export default function AdminProduct({
  show,
  setShow,
  titleForm,
  item,
  refetch,
}) {
  // setup state popup
  const [showPopup, setShowPopup] = useState(false);
  // setup state error
  const [alert, setAlert] = useState("");
  const [title, setTitle] = useState("");
  // setup product form
  const [form, setForm] = useState({
    name: "",
    stock: "",
    price: "",
    desc: "",
    image: "",
  });
  // fetch product item
  useEffect(() => {
    setForm({
      name: item?.name || "",
      stock: item?.stock || "",
      price: item?.price || "",
      desc: item?.desc || "",
      image: item?.image || "",
    });
  }, [item?.desc, item?.image, item?.name, item?.price, item?.stock]);
  // setup state image preview
  const [preview, setPreview] = useState(null);
  // setup handle on change form
  function handleOnChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });
    // create temporary url for image preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  }
  // setup handle on submit add product form
  const handleOnSubmitPost = useMutation(async (e) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // convert to form-data
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("stock", parseInt(form.stock));
      formData.append("price", parseInt(form.price));
      formData.append("image", form?.image[0] || "");
      formData.append("desc", form.desc);
      // get response from product
      const response = await API.post("/product", formData, config);
      // set popup when response success
      if (response.status === 200) {
        setShowPopup(true);
        setTitle("Success Add Product");
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
      setTitle("Failed Add Product");
      setAlert("#DC3545");
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    }
  });
  // setup handle on submit update product form
  const handleOnSubmitPatch = useMutation(async (e) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // convert to form-data
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("stock", parseInt(form.stock));
      formData.append("price", parseInt(form.price));
      formData.append("image", form?.image[0] || "");
      formData.append("desc", form.desc);
      console.log(...formData);
      // get response from product
      const response = await API.patch("/product/" + item.id, formData, config);
      // set popup when response success
      if (response.status === 200) {
        setShowPopup(true);
        setTitle("Success Update Product");
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
      setTitle("Failed Update Product");
      setAlert("#DC3545");
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    }
  });
  // setup handle close form
  function handleClose() {
    setShow(false);
    setForm({
      name: "",
      stock: "",
      price: "",
      desc: "",
      image: "",
    });
  }

  return (
    <Modal show={show} onHide={handleClose} scrollable>
      <Modal.Body className="p-5">
        <Form
          onSubmit={(e) => {
            titleForm === "Add Product" ? (
              handleOnSubmitPost.mutate(e)
            ) : titleForm === "Update Product" ? (
              handleOnSubmitPatch.mutate(e)
            ) : (
              <></>
            );
          }}
        >
          <Row>
            <Col xs={12}>
              <h2 className="text-left color-main fw-bold">{titleForm}</h2>
              <Form.Group className="my-2">
                <FloatingLabel label="Name">
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    name="name"
                    onChange={handleOnChange}
                    value={form.name}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="my-2">
                <FloatingLabel label="Stock">
                  <Form.Control
                    type="number"
                    placeholder="Stock"
                    name="stock"
                    onChange={handleOnChange}
                    value={form.stock}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="my-2">
                <FloatingLabel label="Price">
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    name="price"
                    onChange={handleOnChange}
                    value={form.price}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="my-2">
                <FloatingLabel label="desc">
                  <Form.Control
                    as="textarea"
                    placeholder="desc"
                    name="desc"
                    style={{ height: "100px", resize: "none" }}
                    onChange={handleOnChange}
                    value={form.desc}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group controlId="formFile" className="my-2">
                <Form.Control
                  type="file"
                  placeholder="Profile Image"
                  name="image"
                  onChange={handleOnChange}
                />
              </Form.Group>
            </Col>

            <Col xs={12} className="my-2 d-flex justify-content-center">
              <Image
                src={preview === null ? item.image : preview}
                className="profile-img rounded"
              />
            </Col>
          </Row>
          <Form.Group className=" d-flex flex-row gap-2 justify-content-center">
            <Button className="col-5 btn-main" type="submit">
              Save
            </Button>
            <Button
              className="col-5"
              variant="danger"
              onClick={() => {
                handleClose();
              }}
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

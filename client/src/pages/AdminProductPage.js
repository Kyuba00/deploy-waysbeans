import React, { useState } from "react";
import { Button, Container, Row, Table } from "react-bootstrap";
import rupiahFormat from "rupiah-format";
import { useQuery } from "react-query";
// API
import { API } from "../configs/api";
// components
import AdminProduct from "../components/form/AdminProduct";
import PopupConfirm from "../components/popup/PopupConfirm";
// utilities
import UpperCase from "../utils/UpperCase";

export default function AdminProductPage() {
  document.title = "Waysbeans | Admin Product";
  // setup state popup confirm action
  const [showDelete, setShowDelete] = useState(false);
  // setup state target action
  const [cartTarget, setCartTarget] = useState();
  // setup state product form
  const [showForm, setShowForm] = useState(false);
  // setup title product form
  const [title, setTitle] = useState("");
  // get products
  const { data: products, refetch } = useQuery("productsCache", async () => {
    const response = await API.get("/products");
    return response.data.data;
  });
  // setup item product form
  const [item, setItem] = useState({
    id: "",
    name: "",
    stock: "",
    price: "",
    desc: "",
    image: "",
  });
  // setup handle delete product
  async function handleDelete(id) {
    await API.delete("/product/" + id);
    refetch();
  }
  return (
    <Container className="my-5">
      <h2 className="fw-bold color-main">Product List</h2>
      <Button
        className="btn btn-navbar btn-main p-2 mb-2"
        onClick={() => {
          setShowForm(true);
          setTitle("Add Product");
        }}
      >
        Add Product
      </Button>
      <Row>
        <Table bordered hover responsive="sm">
          <thead>
            <tr className="table-secondary">
              <th>No</th>
              <th>Name</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((item, index) => (
              <tr key={index}>
                <td className="align-middle">{index + 1}</td>
                <td className="align-middle">{UpperCase(item.name)} Beans</td>
                <td className="align-middle">{item.stock}</td>
                <td className="align-middle">
                  {rupiahFormat.convert(item.price)}
                </td>
                <td className="align-middle">
                  <Button
                    className="btn btn-navbar col-5 mx-2"
                    variant="success"
                    onClick={() => {
                      setShowForm(true);
                      setItem(item);
                      setTitle("Update Product");
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    className="btn btn-navbar col-5 mx-2"
                    variant="danger"
                    onClick={() => {
                      setShowDelete(true);
                      setCartTarget(item.id);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <AdminProduct
        show={showForm}
        setShow={setShowForm}
        titleForm={title}
        item={item}
        refetch={refetch}
      />
      <PopupConfirm
        show={showDelete}
        target={cartTarget}
        setShow={setShowDelete}
        setTarget={setCartTarget}
        setDelete={handleDelete}
      />
    </Container>
  );
}

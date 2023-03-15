import React, { useState } from "react";
import { Container, Table, Row } from "react-bootstrap";
import { useQuery } from "react-query";
import rupiahFormat from "rupiah-format";
import moment from "moment";
// API
import { API } from "../configs/api";
// components
import PopupAdmin from "../components/popup/PopupAdmin";

export default function AdminPage() {
  document.title = "Waysbeans | Admin Panel";
  // setup state detail modal
  const [show, setShow] = useState(false);
  // setup content target
  const [itemTarget, setItemTarget] = useState();
  // get transaction data
  const { data: adminTransaction } = useQuery(
    "adminTransactionCache",
    async () => {
      const response = await API.get("/admin/transaction");
      return response.data.data;
    }
  );

  return (
    <Container className="my-5">
      <h2 className="fw-bold color-main my-3">Income Transaction</h2>
      <Row>
        <Table bordered hover responsive="sm">
          <thead>
            <tr className="table-secondary">
              <th className="text-center">No</th>
              <th className="text-center">Transaction Number</th>
              <th className="text-center">Date</th>
              <th className="text-center">Name</th>
              <th className="text-center">Address</th>
              <th className="text-center">Total</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {adminTransaction?.map((item, index) => (
              <tr
                key={index}
                onClick={() => {
                  setShow(true);
                  setItemTarget(item?.cart);
                }}
              >
                <td>{index + 1}</td>
                <td>{item.id}</td>
                <td> {moment(item.update_at).format("dddd, DD MMMM YYYY")}</td>
                <td>{item.name}</td>
                <td>{item.address}</td>
                <td className="text-end">{rupiahFormat.convert(item.total)}</td>
                <td
                  className={
                    item.status === "success"
                      ? "text-success"
                      : item.status === "pending"
                      ? "text-warning"
                      : item.status === "failed"
                      ? "text-danger"
                      : ""
                  }
                >
                  {item.status === "success"
                    ? "Success"
                    : item.status === "pending"
                    ? "Waiting Payment"
                    : item.status === "failed"
                    ? "Failed"
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <PopupAdmin show={show} setShow={setShow} item={itemTarget} />
    </Container>
  );
}

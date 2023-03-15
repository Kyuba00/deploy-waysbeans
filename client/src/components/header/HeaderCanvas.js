import React, { useEffect, useState } from "react";
import { Badge, Button, Dropdown, Image, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
// API
import { API } from "../../configs/api";
// assets
import iconCart from "../../assets/icons/icon_cart.svg";
import iconUser from "../../assets/images/default-profile.png";
import iconProfile from "../../assets/icons/icon_profile.svg";
import iconProduct from "../../assets/icons/icon_product.svg";
import iconLogout from "../../assets/icons/icon_logout.svg";

export default function HeaderCanvas({ user, logout, cart }) {
  const navigate = useNavigate();

  // setup state responsive
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, [width]);

  const { data: profile } = useQuery("profileCache", async () => {
    const response = await API.get("/user");
    return response.data.data;
  });

  return (
    <>
      {width >= 992 ? (
        <>
          {user.status === "buyer" ? (
            <Nav className="gap-2 col-lg-4 justify-content-end">
              <Button
                className="btn btn-user col-12 align-items-center position-relative"
                onClick={() => navigate("/transaction")}
              >
                <Image src={iconCart} className="icon-menu me-3" />
                {cart?.length > 0 ? (
                  <Badge className="position-absolute badge-position rounded-pill bg-danger">
                    {cart?.length}
                  </Badge>
                ) : (
                  <></>
                )}
              </Button>
              <Dropdown className="col-lg-12 position-relative">
                <Dropdown.Toggle
                  className="btn btn-user col-12 align-items-center"
                  variant="light"
                >
                  {profile?.image === "" ? (
                    <>
                      {" "}
                      <Image
                        src={iconUser}
                        className="icon-user border border-dark"
                      />
                    </>
                  ) : (
                    <>
                      {" "}
                      <Image
                        src={profile?.image}
                        className="icon-user border border-dark"
                      />
                    </>
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu className="position-absolute drop-menu">
                  <Dropdown.Item onClick={() => navigate("/profile")}>
                    <Image src={iconProfile} className="icon-menu me-3" />
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => logout()}>
                    <Image src={iconLogout} className="icon-menu me-3" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          ) : (
            <Nav className="gap-2 col-lg-4 justify-content-end">
              <Dropdown className="col-lg-12">
                <Dropdown.Toggle
                  variant="light"
                  className="btn btn-user col-12 align-items-center"
                >
                  {profile?.image === "" ? (
                    <>
                      {" "}
                      <Image src={iconUser} className="icon-user border-dark" />
                    </>
                  ) : (
                    <>
                      {" "}
                      <Image
                        src={profile?.image}
                        className="icon-user border-dark"
                      />
                    </>
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu className="position-absolute drop-menu">
                  <Dropdown.Item onClick={() => navigate("/products")}>
                    <Image src={iconProduct} className="icon-menu me-3" />
                    Product
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => logout()}>
                    <Image src={iconLogout} className="icon-menu me-3" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          )}
        </>
      ) : (
        <>
          {user.status === "buyer" ? (
            <Nav className="gap-2 justify-content-end">
              <Nav.Link
                className="position-relative py-0"
                onClick={() => navigate("/transaction")}
              >
                <Image src={iconCart} className="icon-menu me-3" />
                {cart?.length > 0 ? (
                  <Badge className="position-absolute badge-position rounded-pill bg-danger">
                    {cart?.length}
                  </Badge>
                ) : (
                  <></>
                )}
                Cart
              </Nav.Link>
              <hr className="hr-cart" />
              <Nav.Link className=" py-0" onClick={() => navigate("/profile")}>
                <Image src={iconProfile} className="icon-menu me-3" />
                Profile
              </Nav.Link>
              <hr className="hr-cart" />
              <Nav.Link className=" py-0">
                <Image
                  src={iconLogout}
                  className="icon-menu me-3"
                  onClick={() => logout()}
                />
                Logout
              </Nav.Link>
            </Nav>
          ) : (
            <Nav className="gap-2 justify-content-end">
              <Nav.Link className=" py-0" onClick={() => navigate("/products")}>
                <Image src={iconProduct} className="icon-menu me-3" />
                Product
              </Nav.Link>
              <hr className="hr-cart" />
              <Nav.Link className=" py-0">
                <Image
                  src={iconLogout}
                  className="icon-menu me-3"
                  onClick={() => logout()}
                />
                Logout
              </Nav.Link>
            </Nav>
          )}
        </>
      )}
    </>
  );
}

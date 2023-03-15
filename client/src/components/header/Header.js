import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Container,
  Image,
  Nav,
  Navbar,
  Offcanvas,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
// API
import { API } from "../../configs/api";
// assets
import iconLogo from "../../assets/icons/icon_logo_navbar.svg";
// contexts
import { UserContext } from "../../contexts/UserContext";
// components
import Login from "../auth/Login";
import Register from "../auth/Register";
import HeaderCanvas from "./HeaderCanvas";

export default function Header() {
  const navigate = useNavigate();
  // setup state offcanvas header
  const [showCanvas, setShowCanvas] = useState(false);
  // setup state auth form
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  // setup user context
  const [state, dispatch] = useContext(UserContext);
  // get cart user

  const { data: cart, refetch } = useQuery("cartCache", async () => {
    if (state.isLogin === true) {
      const response = await API.get("/carts");
      return response.data.data;
    }
  });
  // logout
  function logout() {
    dispatch({
      type: "LOGOUT",
    });
    navigate(0);
  }
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Navbar className="shadow" bg="light" expand="lg">
      <Container>
        {state.isLogin === false ? (
          <>
            <Navbar.Brand as={Link} to="/">
              <Image src={iconLogo} alt="waysbeans logo" />
            </Navbar.Brand>
          </>
        ) : (
          <>
            {state.user.status === "admin" ? (
              <>
                <Navbar.Brand as={Link} to="/admin">
                  <Image src={iconLogo} alt="waysbeans logo" />
                </Navbar.Brand>
              </>
            ) : (
              <>
                <Navbar.Brand as={Link} to="/">
                  <Image src={iconLogo} alt="waysbeans logo" />
                </Navbar.Brand>
              </>
            )}
          </>
        )}
        <Navbar.Toggle
          aria-controls="offcanvasNavbar-expand-lg"
          onClick={() => setShowCanvas(true)}
        />
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-lg"
          aria-labelledby="offcanvasNavbarLabel-expand-lg"
          placement="end"
          show={showCanvas}
          onHide={() => setShowCanvas(false)}
          className="offcanvas-nav"
        >
          <Offcanvas.Header className="fw-bold justify-content-center">
            <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
              <Image src={iconLogo} className="img-fluid" />
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="justify-content-end">
            {state.isLogin === false ? (
              <Nav className="gap-2 justify-content-end">
                <Button
                  className="btn btn-navbar btn-white col-12"
                  onClick={() => {
                    setShowLogin(true);
                    setShowCanvas(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setShowRegister(true);
                    setShowCanvas(false);
                  }}
                  className="btn btn-navbar btn-main col-12"
                >
                  Register
                </Button>
              </Nav>
            ) : (
              <HeaderCanvas user={state.user} cart={cart} logout={logout} />
            )}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
      <Login
        show={showLogin}
        setShow={setShowLogin}
        setShowRegister={setShowRegister}
      />
      <Register
        show={showRegister}
        setShow={setShowRegister}
        setShowLogin={setShowLogin}
      />
    </Navbar>
  );
}

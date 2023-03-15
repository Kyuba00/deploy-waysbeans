import React from "react";
import { Container, Image } from "react-bootstrap";
import "../assets/css/pulse.css";

// assets
import iconLogo from "../assets/icons/icon_logo_navbar.svg";

export default function LoadingPage() {
  return (
    <Container className="loading-page p-0 my-0 mx-auto d-flex justify-content-center align-items-center">
      <Image src={iconLogo} className="img-fluid loading-image" />
    </Container>
  );
}

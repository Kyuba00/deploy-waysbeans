import React from "react";
import { Col, Container, Image } from "react-bootstrap";

// assets
import heroLogo from "../../assets/icons/icon_logo_hero.svg";
import iconWaves from "../../assets/icons/icon_waves.svg";
import heroImage from "../../assets/images/hero-image.png";

export default function HeroSection() {
  return (
    <Container>
      <Col md={10} className="my-5 bg-hero position-relative">
        <Col md={7} className="p-5 d-flex flex-column gap-4">
          <Image src={heroLogo} />
          <h5 className="text-black">BEST QUALITY COFFEE BEANS</h5>
          <p className="text-black">
            Quality freshly roasted coffee made just for you. Pour, brew and
            enjoy
          </p>
        </Col>
        <Image src={iconWaves} className="waves" />
        <Image src={heroImage} className="rounded hero-img img-fluid" />
      </Col>
    </Container>
  );
}

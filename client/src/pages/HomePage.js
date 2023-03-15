import React, { useContext } from "react";
import { useQuery } from "react-query";
// API
import { API } from "../configs/api";
// components
import HeroSection from "../components/home/HeroSection";
import ProductList from "../components/home/ProductList";
// contexts
import { UserContext } from "../contexts/UserContext";

export default function HomePage() {
  document.title = "Waysbeans | Home";
  // setup user context
  const [state] = useContext(UserContext);
  // get products
  const { data: products } = useQuery("productsCache", async () => {
    const response = await API.get("/products");
    return response.data.data;
  });

  return (
    <>
      <HeroSection />
      <ProductList state={state} data={products} />
    </>
  );
}

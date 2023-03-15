import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
// API
import { API, setAuthToken } from "./configs/api";
// contexts
import { UserContext } from "./contexts/UserContext";
// pages
import LoadingPage from "./pages/LoadingPage";
import Header from "./components/header/Header";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import TransactionPage from "./pages/TransactionPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import AdminProductPage from "./pages/AdminProductPage";

// initialize axios token
if (localStorage.token) {
  setAuthToken(localStorage.token);
}
export default function App() {
  const navigate = useNavigate();
  // get user context
  const [state, dispatch] = useContext(UserContext);
  // setup state loading
  const [isLoading, setIsloading] = useState(true);
  // setup redirect auth
  useEffect(() => {
    if (state.isLogin === false && !isLoading) {
      navigate("/");
    } else {
      if (state.user.status === "admin") {
        navigate("/admin");
      } else if (state.user.status === "buyer") {
        navigate("/");
      }
    }
    // post token to local storage
    setAuthToken(localStorage.token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  // get check auth
  async function checkAuth() {
    try {
      // get auth response
      const response = await API.get("/auth");
      // get response data
      let payload = response.data.data;
      // post token to local storage
      payload.token = localStorage.token;
      // dispatch status
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
      // change state loading
      setIsloading(false);
    } catch (error) {
      // check error if from network
      if (error.code === "ERR_NETWORK") {
        // dispatch status
        return (
          dispatch({
            type: "AUTH_ERROR",
          }),
          setIsloading(false),
          alert("Server Is Under Maintenance")
        );
      }
      // check error auth response if from client side
      else if (error.response?.status >= 400 && error.response?.status <= 499) {
        // dispatch status
        return (
          dispatch({
            type: "AUTH_ERROR",
          }),
          // change state loading
          setIsloading(false),
          // redirect to homepage
          navigate("/")
        );
        // check error auth response if from server side
      } else if (
        error.response?.status >= 500 &&
        error.response?.status <= 599
      ) {
        // dispatch status
        return (
          dispatch({
            type: "AUTH_ERROR",
          }),
          // change state loading
          setIsloading(false),
          // redirect to homepage
          navigate("/"),
          alert("Server Is Under Maintenance")
        );
      }
    }
  }
  // use effect running check auth
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <LoadingPage />
        </>
      ) : (
        <>
          <Header />
          <Routes>
            {/* user */}
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/transaction" element={<TransactionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* admin */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/products" element={<AdminProductPage />} />
          </Routes>
        </>
      )}
    </>
  );
}

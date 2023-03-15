import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
// components
import App from "./App";
// contexts
import { UserContextProvider } from "./contexts/UserContext";
// styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/index.css";

// setup client query
const client = new QueryClient();
// get root id from html
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <QueryClientProvider client={client}>
        <Router>
          <App />
        </Router>
      </QueryClientProvider>
    </UserContextProvider>
  </React.StrictMode>
);

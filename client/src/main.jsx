import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@styles/light_theme.scss";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "react-auth-kit";
import authStore from "@/utils/auth.js";
<<<<<<< HEAD
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import allReducers from "@reducers/index.js";
=======
// import { configureStore } from "@reduxjs/toolkit";
// import { Provider } from "react-redux";
>>>>>>> c1b75534c8dd9bfbbe76fa33f127eb74fde7de47

const store = configureStore({
  reducer: allReducers,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider store={authStore}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

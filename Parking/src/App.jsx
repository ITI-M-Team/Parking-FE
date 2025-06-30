
import React from "react";
import LoginForm from "./components/LoginForm";
import PasswordResetFlow from "./PasswordResetFlow/pages/PasswordResetFlow";
import RegisterUser from "./components/RegisterUser";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import RouteList from './Routes/RouteList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/password-reset" element={<PasswordResetFlow />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/home" element={<Home />} />
        <RouteList/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


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
               <RouteList/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

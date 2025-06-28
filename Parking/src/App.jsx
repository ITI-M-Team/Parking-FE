import React from "react";
import LoginForm from "./components/LoginForm";
import PasswordResetFlow from "./components/PasswordResetFlow";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/password-reset" element={<PasswordResetFlow />} /> 
             </Routes>
    </BrowserRouter>
  );
}

export default App;

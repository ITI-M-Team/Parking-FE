import React from "react";
import LoginForm from "./components/LoginForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

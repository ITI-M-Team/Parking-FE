import React from "react";
import LoginForm from "./components/LoginForm";
import DriverDashboard from "./components/DriverDashboard";
import GarageDashboard from "./components/GarageDashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NearbyGarages from "./components/NearbyGarages";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard/driver" element={<DriverDashboard />} />
        <Route path="/dashboard/garage" element={<GarageDashboard />} />
        <Route path="/nearby-garages" element={<NearbyGarages />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

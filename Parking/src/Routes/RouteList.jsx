import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";

import LoginForm from '../components/LoginForm';
import DriverDashboard from '../components/DriverDashboard';
import GarageDashboard from '../components/GarageDashboard';
import RegisterUser from '../components/RegisterUser';
import Home from '../components/Home';
import Profile from '../Pages/Profile';
import Settings from '../Pages/Settings';
import NearbyGarages from "../components/NearbyGarages";
import PasswordResetFlow from "../PasswordResetFlow/pages/PasswordResetFlow";

function RouteList() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginForm darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/register" element={<RegisterUser darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/home" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/dashboard/driver" element={<DriverDashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/dashboard/garage" element={<GarageDashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/profile" element={<Profile darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/nearby-garages" element={<NearbyGarages darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/password-reset" element={<PasswordResetFlow />} />
    </Routes>
  );
}

export default RouteList;

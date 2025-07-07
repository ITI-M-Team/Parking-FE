
import React, { useState, useEffect } from 'react'
import { Route, Routes } from "react-router-dom"
import Theme from '../components/Theme'
import LoginForm from '../components/LoginForm'
import ProtectedRedirect from '../components/ProtectedRedirect';
import DriverDashboard from '../components/DriverDashboard';
import GarageDashboard from '../components/GarageDashboard';
import RegisterUser from '../components/RegisterUser'
import Home from '../components/Home'
import Profile from '../Pages/Profile'
import Settings from '../Pages/Settings'
import NearbyGarages from "../components/NearbyGarages";
import GarageDetails from '../Pages/GarageDetails'
import Manual from '../components/Manual';
import PasswordResetFlow from "../PasswordResetFlow/pages/PasswordResetFlow";
import Activation from '../components/Activation';

import OwnerDashboard from '../components/OwnerDashboard';

import AdminDashboard from '../Pages/AdminDashboard';
import AdminProtectedRoute from '../components/AdminWrapper/AdminProtectedRoute';
import NotAuthorizedPage from '../components/AdminWrapper/NotAuthorizedPage';
import GarageRegister from '../components/GarageData/GarageRegister';


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
            <Route path="/" element={<ProtectedRedirect darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path='/register' element={<RegisterUser darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path='/home' element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/login" element={<LoginForm darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/dashboard/driver" element={<DriverDashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/dashboard/garage" element={<GarageDashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path='/profile' element={<Profile darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path='/settings' element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/nearby-garages" element={<NearbyGarages darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/garages/:id" element={<GarageDetails />} />
            <Route path="/password-reset" element={<PasswordResetFlow darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/manual" element={<Manual />} />
            <Route path='/activation' element={<Activation darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/dashboard/owner" element={<OwnerDashboard darkMode={darkMode} setDarkMode={setDarkMode} />} /> {/* <--- أضف هذا المسار */}
            <Route path='/admin' element={<AdminProtectedRoute> <AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} /> </AdminProtectedRoute>} />
            <Route path='/not-authorized' element={<NotAuthorizedPage />} />
            <Route path="/garage/register" element={<GarageRegister darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>

    )
}

export default RouteList

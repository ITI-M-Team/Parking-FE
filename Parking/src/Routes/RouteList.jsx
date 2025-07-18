
import React, { useState, useEffect } from 'react'
import { Route, Routes } from "react-router-dom"
import MainLayout from '../components/RoutesWrapper/MainLayout';
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
import CurrentBooking from "../components/CurrentBooking"
import AdminDashboard from '../Pages/AdminDashboard';
import AdminProtectedRoute from '../components/AdminWrapper/AdminProtectedRoute';
import NotAuthorizedPage from '../components/AdminWrapper/NotAuthorizedPage';
import GarageRegister from '../components/GarageData/GarageRegister';
import GarageEdit from '../components/GarageData/GarageEdit';
import GarageOccupancy from '../components/GarageData/GarageOccupancy';
import QRCodeScanner from '../components/QRCodeScanner';
// for basic authentication
import AuthProtectedRoute from '../components/Verification/AuthProtectedRoute';
// route to protect verification status
import VerificationProtectedRoute from '../components/Verification/VerificationProtectedRoute';
// route to protect owner/garage specific routes
import OwnerProtectedRoute from '../components/Verification/OwnerProtectedRoute';
import { Navigate } from 'react-router-dom';
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
            <Route element={<MainLayout darkMode={darkMode} setDarkMode={setDarkMode} />}>
                <Route path="/" element={<ProtectedRedirect darkMode={darkMode} setDarkMode={setDarkMode} />} />   
                 {/* Pages accessible to authenticated users (even if pending verification) */}
                <Route path='/home' element={<AuthProtectedRoute><Home darkMode={darkMode} setDarkMode={setDarkMode} /></AuthProtectedRoute>} />
                <Route path="/manual" element={<AuthProtectedRoute><Manual /></AuthProtectedRoute>} />
                <Route path='/profile' element={<AuthProtectedRoute><Profile darkMode={darkMode} setDarkMode={setDarkMode} /></AuthProtectedRoute>} />  
                <Route path="/password-reset" element={<AuthProtectedRoute><PasswordResetFlow darkMode={darkMode} setDarkMode={setDarkMode} /></AuthProtectedRoute>} />           
                {/* Routes that require verification */}
                <Route path="/dashboard/driver" element={<VerificationProtectedRoute><DriverDashboard darkMode={darkMode} setDarkMode={setDarkMode} /></VerificationProtectedRoute>} />
                <Route path="/nearby-garages" element={<VerificationProtectedRoute> <NearbyGarages darkMode={darkMode} setDarkMode={setDarkMode}/> </VerificationProtectedRoute>} />
                <Route path="/garages/:id" element={<VerificationProtectedRoute> <GarageDetails darkMode={darkMode} setDarkMode={setDarkMode} /></VerificationProtectedRoute>} />
                <Route path="/currentbooking/" element={<VerificationProtectedRoute><CurrentBooking darkMode={darkMode} setDarkMode={setDarkMode} /></VerificationProtectedRoute>}/>
                {/* ------------- */}
                {/* Routes that require owner/garage role - Protected for owners and superusers only */}
                <Route path="/dashboard/garage" element={<OwnerProtectedRoute><GarageDashboard darkMode={darkMode} setDarkMode={setDarkMode} /></OwnerProtectedRoute>} />
                <Route path="/dashboard/owner" element={<OwnerProtectedRoute><OwnerDashboard darkMode={darkMode} setDarkMode={setDarkMode} /></OwnerProtectedRoute>}/> {/* <--- أضف هذا المسار */}
                <Route path="/garage/register" element={<OwnerProtectedRoute><GarageRegister darkMode={darkMode} setDarkMode={setDarkMode} /></OwnerProtectedRoute>} />
                <Route path="/garage/edit/:id" element={<OwnerProtectedRoute><GarageEdit darkMode={darkMode} setDarkMode={setDarkMode} /></OwnerProtectedRoute> } />
                <Route path="/garage/occupancy/:id" element={<OwnerProtectedRoute><GarageOccupancy darkMode={darkMode} setDarkMode={setDarkMode} /></OwnerProtectedRoute>} />
                <Route path="/scanner" element={<OwnerProtectedRoute><QRCodeScanner darkMode={darkMode} setDarkMode={setDarkMode} /></OwnerProtectedRoute>} />
                {/* ------------ */}
                <Route path="*" element={<Navigate to="/not-authorized" replace />} />
            </Route>
            <Route path='/settings' element={<AuthProtectedRoute><Settings darkMode={darkMode} setDarkMode={setDarkMode} /></AuthProtectedRoute>} />
            
            {/* Public Routes */}
            <Route path='/register' element={<RegisterUser darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/login" element={<LoginForm darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path='/activation' element={<Activation darkMode={darkMode} setDarkMode={setDarkMode} />} />
            {/* Admin route - super user only */}
            <Route path='/admin' element={<AdminProtectedRoute> <AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} /> </AdminProtectedRoute>} />
            {/* Error pages */}
            <Route path='/not-authorized' element={<NotAuthorizedPage />} />
        </Routes>

    )
}

export default RouteList

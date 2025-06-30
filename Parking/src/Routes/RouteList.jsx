    import React, { useState, useEffect } from 'react'
    import {Route ,Routes} from "react-router-dom"
    import Theme from '../components/Theme'
    import LoginForm from '../components/LoginForm'
    import ProtectedRedirect from '../components/ProtectedRedirect';
    import DriverDashboard from '../components/DriverDashboard';     
    import GarageDashboard from '../components/GarageDashboard';   
    import RegisterUser from '../components/RegisterUser'
    import Home from '../components/Home'
    import NewLogin from '../components/NewLogin'
    import Profile from '../Pages/Profile'
    import Settings from '../Pages/Settings'
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
                <Route path='/register' element={<RegisterUser darkMode={darkMode} setDarkMode={setDarkMode}/>}/>
                <Route path='/home' element={<Home darkMode={darkMode} setDarkMode={setDarkMode}/>}/>
                <Route path="/login" element={<LoginForm darkMode={darkMode} setDarkMode={setDarkMode}/>} />
                <Route path="/dashboard/driver" element={<DriverDashboard darkMode={darkMode} setDarkMode={setDarkMode}/>} />
                <Route path="/dashboard/garage" element={<GarageDashboard darkMode={darkMode} setDarkMode={setDarkMode}/>} />
                <Route path='/profile' element={<Profile darkMode={darkMode} setDarkMode={setDarkMode}/>}/>
                <Route path='/settings' element={<Settings darkMode={darkMode} setDarkMode={setDarkMode}/>}/>
            </Routes>

    )
    }

    export default RouteList
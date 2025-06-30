import React, { useState, useEffect } from 'react'
import {Route ,Routes} from "react-router-dom"
import Theme from '../components/Theme'
import LoginForm from '../components/LoginForm'
import RegisterUser from '../components/RegisterUser'
import Home from '../components/Home'
import NewLogin from '../components/NewLogin'
import Profile from '../Pages/Profile'
import Settings from '../Pages/Settings'
import PasswordResetFlow from '../PasswordResetFlow/pages/PasswordResetFlow'
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
            <Route path='/login' element={<NewLogin darkMode={darkMode} setDarkMode={setDarkMode}/>}/>
            <Route path='/register' element={<RegisterUser/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/profile' element={<Profile darkMode={darkMode} setDarkMode={setDarkMode}/>}/>
            <Route path='/settings' element={<Settings darkMode={darkMode} setDarkMode={setDarkMode}/>}/>
            <Route path='/password-reset' element={<PasswordResetFlow darkMode={darkMode} setDarkMode={setDarkMode}/>}/>            
        </Routes>

  )
}

export default RouteList
import React from 'react'
import Header from "../Header"
import Footer from '../Footer';
import { Outlet } from 'react-router-dom';
function MainLayout({ darkMode, setDarkMode }) {
  return (
    <>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
            <main className="min-h-screen">
                <Outlet />
            </main>
        <Footer darkMode={darkMode} setDarkMode={setDarkMode} />
    </>
  )
}

export default MainLayout
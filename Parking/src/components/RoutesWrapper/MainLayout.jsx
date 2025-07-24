import React from 'react'
import Header from "../Header"
import Footer from '../Footer';
import { Outlet } from 'react-router-dom';
import Chatbot from "../../Pages/ Chatbot";  // Fixed import path

function MainLayout({ darkMode, setDarkMode }) {
  return (
    <>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer darkMode={darkMode} setDarkMode={setDarkMode} />
      <Chatbot darkMode={darkMode} />
    </>
  )
}

export default MainLayout
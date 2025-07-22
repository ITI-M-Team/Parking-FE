
import React, { useState } from "react";
import Step1_RequestOTP from "../components/Step1_RequestOTP";
import Step2_VerifyOTP from "../components/Step2_VerifyOTP";
import Step3_ConfirmPassword from "../components/Step3_ConfirmPassword";
import Step4_Success from "../components/Step4_Success";
import "../styles/PasswordResetFlow.css";
import bgImage from "../../assets/images/background-home.png"; 
import { useLanguage } from '../../context/LanguageContext'; 

const PasswordResetFlow = () => {
  const { language } = useLanguage(); 

  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

 
  const t = {
    en: {
      title: "Reset Your Password",
      appName: "Parking App"
    },
    ar: {
      title: "إعادة تعيين كلمة المرور",
      appName: "تطبيق وقوف السيارات"
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center transition-colors"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Content */}
      <div className={`relative z-10 min-h-screen ${darkMode ? "text-white" : "text-gray-900"}`}>
        {/* Navbar */}
        {/* <nav className={`w-full p-4 shadow-md flex justify-between items-center ${darkMode ? "bg-gray-800/70" : "bg-white/70"} backdrop-blur`}>
          <h1 className="text-xl font-bold">{t[language].appName}</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 text-sm rounded-md transition hover:scale-105 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-900"}`}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </nav> */}

        {/* Main content */}
        <div className="flex justify-center items-center px-4 py-12">
          <div
            className={`w-full max-w-xl rounded-lg shadow-lg p-8 transition-colors backdrop-blur-md ${
              darkMode ? "bg-gray-800/90 text-white" : "bg-white/90 text-gray-900"
            }`}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">{t[language].title}</h2>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {message && <p className="text-green-500 mb-4 text-center">{message}</p>}

            {step === 1 && (
              <Step1_RequestOTP
                {...{
                  method,
                  setMethod,
                  email,
                  setEmail,
                  phone,
                  setPhone,
                  setStep,
                  setMessage,
                  setError,
                  resetMessages,
                  darkMode,
                  setDarkMode,
                }}
              />
            )}
            {step === 2 && (
              <Step2_VerifyOTP
                {...{
                  method,
                  email,
                  phone,
                  otp,
                  setOTP,
                  setStep,
                  setMessage,
                  setError,
                  resetMessages,
                  darkMode,
                  setDarkMode,
                }}
              />
            )}
            {step === 3 && (
              <Step3_ConfirmPassword
                {...{
                  method,
                  email,
                  phone,
                  otp,
                  newPassword,
                  setNewPassword,
                  confirmPassword,
                  setConfirmPassword,
                  setStep,
                  setMessage,
                  setError,
                  resetMessages,
                  darkMode,
                  setDarkMode,
                }}
              />
            )}
            {step === 4 && <Step4_Success darkMode={darkMode} setDarkMode={setDarkMode} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetFlow;

import React from "react";
import { useLanguage } from "../context/LanguageContext"; 

const DriverDashboard = () => {
  const { language } = useLanguage(); 

 
  const t = {
    en: {
      title: "Driver Dashboard",
      welcome: "Welcome, Driver!",
    },
    ar: {
      title: "لوحة قيادة السائق",
      welcome: "مرحبًا، سائق!",
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t[language].title}</h1>
      <p className="text-gray-700">{t[language].welcome}</p>
    </div>
  );
};

export default DriverDashboard;
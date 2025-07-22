import React from "react";
import { useLanguage } from "../context/LanguageContext"; 

const GarageDashboard = () => {
  const { language } = useLanguage(); 

 
  const t = {
    en: {
      title: "Garage Owner Dashboard",
      welcome: "Welcome, Garage Owner!",
    },
    ar: {
      title: "لوحة قيادة مالك الجراج",
      welcome: "مرحبًا، مالك جراج!",
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t[language].title}</h1>
      <p className="text-gray-700">{t[language].welcome}</p>
    </div>
  );
};

export default GarageDashboard;
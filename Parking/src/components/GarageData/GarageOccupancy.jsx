import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../apis/config";
import bgImage from "../../assets/images/background-home.png";
import "../../PasswordResetFlow/styles/PasswordResetFlow.css";
import { useLanguage } from '../../context/LanguageContext'; 

const GarageOccupancy = () => {
  const { id } = useParams();
  const { language } = useLanguage(); 
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [occupancy, setOccupancy] = useState(null);
  const [error, setError] = useState("");

  const token = (() => {
    try {
      const authTokens = JSON.parse(sessionStorage.getItem("authTokens"));
      return authTokens?.access;
    } catch {
      return null;
    }
  })();

 
  const t = {
    en: {
      title: "Garage Occupancy Status",
      garageId: "Garage ID",
      totalSpots: "Total Spots",
      occupiedSpots: "Occupied Spots",
      availableSpots: "Available Spots",
      loading: "Loading occupancy data...",
      errorAuth: "Not authenticated",
      errorFetch: "❌ Failed to fetch occupancy data",
      darkMode: "🌙 Dark Mode",
      lightMode: "☀️ Light Mode"
    },
    ar: {
      title: "حالة اشغال الجراج",
      garageId: "رقم الجراج",
      totalSpots: "إجمالي المواقف",
      occupiedSpots: "المواقف المشغولة",
      availableSpots: "المواقف المتاحة",
      loading: "جاري تحميل بيانات الاشغال...",
      errorAuth: "غير مصرّح لك بالدخول",
      errorFetch: "❌ فشل في جلب بيانات الاشغال",
      darkMode: "🌙 الوضع الليلي",
      lightMode: "☀️ الوضع النهاري"
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    if (!token) {
      setError(t[language].errorAuth);
      return;
    }

    axios
      .get(`/garages/${id}/occupancy/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOccupancy(res.data))
      .catch((err) => {
        console.error(err);
        const errMsg = err.response?.data?.error || t[language].errorFetch;
        setError(errMsg);
      });
  }, [id, token, language]);

  return (
    <div
      className={`page ${darkMode ? "dark" : ""}`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
   
      <div className="absolute top-4 right-4 z-10">
        <button className="button" onClick={toggleDarkMode}>
          {darkMode ? t[language].lightMode : t[language].darkMode}
        </button>
      </div>

      
      <div className="card">
        <h2 className="title">{t[language].title}</h2>

        {error && <p className="error">{error}</p>}

        {occupancy ? (
          <div className="space-y-3">
            <p><strong>{t[language].garageId}:</strong> {occupancy.garage_id}</p>
            <p><strong>{t[language].totalSpots}:</strong> {occupancy.total_spots}</p>
            <p><strong>{t[language].occupiedSpots}:</strong> {occupancy.occupied_spots}</p>
            <p><strong>{t[language].availableSpots}:</strong> {occupancy.available_spots}</p>
          </div>
        ) : (
          !error && <p>{t[language].loading}</p>
        )}
      </div>
    </div>
  );
};

export default GarageOccupancy;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../apis/config";
import bgImage from "../../assets/images/background-home.png";
import "../../PasswordResetFlow/styles/PasswordResetFlow.css";

const GarageOccupancy = () => {
  const { id } = useParams();
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
      setError("Not authenticated");
      return;
    }

    axios
      .get(`/garages/${id}/occupancy/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOccupancy(res.data))
      .catch((err) => {
        console.error(err);
        const errMsg = err.response?.data?.error || "❌ Failed to fetch occupancy data";
        setError(errMsg);
      });
  }, [id]);

  return (
    <div
      className={`page ${darkMode ? "dark" : ""}`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Toggle theme */}
      <div className="absolute top-4 right-4 z-10">
        <button className="button" onClick={toggleDarkMode}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Card display */}
      <div className="card">
        <h2 className="title">Garage Occupancy Status</h2>

        {error && <p className="error">{error}</p>}

        {occupancy ? (
          <div className="space-y-3">
            <p><strong>Garage ID:</strong> {occupancy.garage_id}</p>
            <p><strong>Total Spots:</strong> {occupancy.total_spots}</p>
            <p><strong>Occupied Spots:</strong> {occupancy.occupied_spots}</p>
            <p><strong>Available Spots:</strong> {occupancy.available_spots}</p>
          </div>
        ) : (
          !error && <p>Loading occupancy data...</p>
        )}
      </div>
    </div>
  );
};

export default GarageOccupancy;

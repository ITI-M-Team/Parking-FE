import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../apis/config";
import bgImage from "../../assets/images/background-home.png";
import "../../PasswordResetFlow/styles/PasswordResetFlow.css";

const GarageRegister = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    opening_hour: "",
    closing_hour: "",
    image: null,
    price_per_hour: "",
    number_of_spots: "",
    block_duration_hours: "",
    reservation_grace_period: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Read JWT token from sessionStorage
  let token = null;
  try {
    const authTokens = JSON.parse(sessionStorage.getItem("authTokens"));
    token = authTokens?.access;
  } catch (error) {
    console.error("Invalid or missing authTokens in sessionStorage");
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const address = data.display_name || "Unknown location";
          setFormData((prev) => ({
            ...prev,
            address,
            latitude,
            longitude,
          }));
        } catch (err) {
          console.error(err);
          alert("Failed to retrieve address.");
        }
      },
      (err) => {
        console.error(err);
        alert("Location access denied.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!token) {
      alert("Please log in first.");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

    try {
      const res = await axios.post("/garages/register/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        alert("Garage registered successfully!");
        navigate("/dashboard/owner");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setErrors(err.response?.data || {});
      alert("Garage registration failed.");
    }
  };

  return (
    <div
      className={`page ${darkMode ? "dark" : ""}`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark mode toggle button */}
      <div className="absolute top-4 right-4 z-10">
        <button className="button" onClick={toggleDarkMode}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Form card */}
      <div className="card">
        <h2 className="title">Register Your Garage</h2>

        <form onSubmit={handleSubmit} className="w-full">
          <input type="text" name="name" placeholder="Garage Name" value={formData.name} onChange={handleChange} className="input" />
          {errors.name && <p className="error">{errors.name}</p>}

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="input" />
            <button type="button" onClick={handleUseLocation} className="button">📍</button>
          </div>
          {errors.address && <p className="error">{errors.address}</p>}

          <input type="text" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} className="input" />
          {errors.latitude && <p className="error">{errors.latitude}</p>}

          <input type="text" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} className="input" />
          {errors.longitude && <p className="error">{errors.longitude}</p>}

          <input type="time" name="opening_hour" value={formData.opening_hour} onChange={handleChange} className="input" />
          <input type="time" name="closing_hour" value={formData.closing_hour} onChange={handleChange} className="input" />

          <input type="number" name="price_per_hour" placeholder="Price per Hour" value={formData.price_per_hour} onChange={handleChange} className="input" />
          {errors.price_per_hour && <p className="error">{errors.price_per_hour}</p>}

          <input type="number" name="number_of_spots" placeholder="Total Number of Spots" value={formData.number_of_spots} onChange={handleChange} className="input" />
          {errors.number_of_spots && <p className="error">{errors.number_of_spots}</p>}

          <input type="number" name="block_duration_hours" placeholder="block duration hours" value={formData.block_duration_hours} onChange={handleChange} className="input" />
          {errors.block_duration_hours && <p className="error">{errors.block_duration_hours}</p>}

          <input type="number" name="reservation_grace_period" placeholder="reservation grace period" value={formData.reservation_grace_period} onChange={handleChange} className="input" />
          {errors.reservation_grace_period && <p className="error">{errors.reservation_grace_period}</p>}

          <input type="file" name="image" onChange={handleChange} className="input" />
          {errors.image && <p className="error">{errors.image}</p>}

          <button type="submit" className="button">Register Garage</button>
        </form>
      </div>
    </div>
  );
};

export default GarageRegister;

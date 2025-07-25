import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../apis/config";
import bgImage from "../../assets/images/background-home.png";
import "../../PasswordResetFlow/styles/PasswordResetFlow.css";

const GarageEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    opening_hour: "",
    closing_hour: "",
    price_per_hour: "",
    reservation_grace_period: "",
    number_of_spots: "",
    image: null,
    contract_document: null,
  });

  const [errors, setErrors] = useState({});
  const [originalSpotCount, setOriginalSpotCount] = useState(0);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  let token = null;
  try {
    const authTokens = JSON.parse(sessionStorage.getItem("authTokens"));
    token = authTokens?.access;
  } catch {
    console.warn("Token not found");
  }

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
    if (!token) return;

    axios
      .get(`/garages/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        setFormData({
          name: data.name || "",
          address: data.address || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
          opening_hour: data.opening_hour || "",
          closing_hour: data.closing_hour || "",
          price_per_hour: data.price_per_hour || "",
          reservation_grace_period: data.reservation_grace_period || "",
          number_of_spots: data.number_of_spots || data.parking_spots?.length || "",
          image: null,
        });
        setOriginalSpotCount(data.parking_spots?.length || 0);
        setCurrentImageUrl(data.image || "");
      })
      .catch((err) => {
        alert("❌ Failed to load garage data");
        console.error(err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newSpotCount = parseInt(formData.number_of_spots, 10);
    if (newSpotCount < originalSpotCount) {
      const confirm = window.confirm(
        `⚠️ You are reducing the number of spots from ${originalSpotCount} to ${newSpotCount}. This will delete available spots. Proceed?`
      );
      if (!confirm) return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        payload.append(key, value);
      }
    });

    try {
      const res = await axios.put(`/garages/${id}/update/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        alert("✅ Garage updated successfully");
        navigate("/dashboard/owner");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setErrors(err.response?.data || {});
      alert("❌ Failed to update garage");
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
      <div className="absolute top-4 right-4 z-10">
        <button className="button" onClick={toggleDarkMode}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="card">
        <h2 className="title">Edit Garage</h2>

        <form onSubmit={handleSubmit} className="w-full space-y-2">
          <input type="text" name="name" placeholder="Garage Name" value={formData.name} onChange={handleChange} className="input" />
          {errors.name && <p className="error">{errors.name}</p>}

          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="input" />
          <input type="text" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} className="input" />
          <input type="text" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} className="input" />

          <input type="time" name="opening_hour" value={formData.opening_hour} onChange={handleChange} className="input" />
          <input type="time" name="closing_hour" value={formData.closing_hour} onChange={handleChange} className="input" />

          <input type="number" name="price_per_hour" placeholder="Price per Hour" value={formData.price_per_hour} onChange={handleChange} className="input" />
          <input type="number" name="reservation_grace_period" placeholder="Grace Period (minutes)" value={formData.reservation_grace_period} onChange={handleChange} className="input" />
          <input type="number" name="number_of_spots" placeholder="Total Spots" value={formData.number_of_spots} onChange={handleChange} className="input" />
          {errors.number_of_spots && <p className="error">{errors.number_of_spots}</p>}

          <input type="file" name="image" onChange={handleChange} className="input" />
          {currentImageUrl && (
            <img src={currentImageUrl} alt="Current Garage" className="w-32 h-32 object-cover mt-2 rounded" />
          )}
          {errors.image && <p className="error">{errors.image}</p>}
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contract Document</label>
          <input
            type="file"
            name="contract_document"
            onChange={handleChange}
            className="input"
          />
          {errors.contract_document && <p className="error">{errors.contract_document}</p>}
          <button type="submit" className="button">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default GarageEdit;

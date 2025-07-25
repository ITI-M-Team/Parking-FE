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
    contract_document: null,
    price_per_hour: "",
    number_of_spots: "",
    block_duration_hours: "",
    reservation_grace_period: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    
    // Clear specific field error when user starts typing/selecting
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  //  Validate contract document file type on frontend (documents and images)
  const validateContractFile = (file) => {
    if (!file) return "Contract document is required.";
    
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const fileExtension = '.' + file.name.toLowerCase().split('.').pop();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return "Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed for contract documents.";
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return "Contract document size cannot exceed 10MB.";
    }
    
    return null;
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
    setIsSubmitting(true);

    if (!token) {
      alert("Please log in first.");
      setIsSubmitting(false);
      return;
    }

    // ✅ Frontend validation for contract document
    const contractError = validateContractFile(formData.contract_document);
    if (contractError) {
      setErrors({ contract_document: contractError });
      alert(contractError);
      setIsSubmitting(false);
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
        setSubmitSuccess(true);
        // Don't navigate immediately, show success message first
        setTimeout(() => {
          navigate("/dashboard/owner");
        }, 3000);
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setErrors(err.response?.data || {});
      
      // Show specific error message
      const errorMessage = err.response?.data?.detail || "Garage registration failed.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message component
  if (submitSuccess) {
    return (
      <div
        className={`page ${darkMode ? "dark" : ""}`}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="card text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="title text-green-600">Registration Submitted Successfully!</h2>
          </div>
          
          <div className="space-y-4 text-left">
            <p className="text-lg">
              Your garage registration has been submitted and is now <strong>under review</strong> by our admin team.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="font-bold mb-2">What happens next?</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Our team will review your garage information and contract document</li>
                <li>This process typically takes 1-3 business days</li>
                <li>You'll receive an email notification once the review is complete</li>
                <li>If approved, your garage will be available for booking by drivers</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
              <p className="text-sm">
                <strong>📧 Email Sent:</strong> We've sent a confirmation email to your registered email address with more details about the verification process.
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Redirecting to dashboard in a few seconds...
            </p>
            <button 
              onClick={() => navigate("/dashboard/owner")} 
              className="button mt-2"
            >
              Go to Dashboard Now
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6">
          <p className="text-sm">
            <strong>📋 Verification Process:</strong> All garage registrations are reviewed by our admin team before approval. You'll receive an email notification once your garage is verified.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <input 
            type="text" 
            name="name" 
            placeholder="Garage Name" 
            value={formData.name} 
            onChange={handleChange} 
            className="input" 
            required
            disabled={isSubmitting}
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input 
              type="text" 
              name="address" 
              placeholder="Address" 
              value={formData.address} 
              onChange={handleChange} 
              className="input" 
              required
              disabled={isSubmitting}
            />
            <button 
              type="button" 
              onClick={handleUseLocation} 
              className="button"
              disabled={isSubmitting}
            >
              📍
            </button>
          </div>
          {errors.address && <p className="error">{errors.address}</p>}

          <input 
            type="text" 
            name="latitude" 
            placeholder="Latitude" 
            value={formData.latitude} 
            onChange={handleChange} 
            className="input" 
            required
            disabled={isSubmitting}
          />
          {errors.latitude && <p className="error">{errors.latitude}</p>}

          <input 
            type="text" 
            name="longitude" 
            placeholder="Longitude" 
            value={formData.longitude} 
            onChange={handleChange} 
            className="input" 
            required
            disabled={isSubmitting}
          />
          {errors.longitude && <p className="error">{errors.longitude}</p>}

          <input 
            type="time" 
            name="opening_hour" 
            value={formData.opening_hour} 
            onChange={handleChange} 
            className="input" 
            required
            disabled={isSubmitting}
          />
          
          <input 
            type="time" 
            name="closing_hour" 
            value={formData.closing_hour} 
            onChange={handleChange} 
            className="input" 
            required
            disabled={isSubmitting}
          />

          <input 
            type="number" 
            name="price_per_hour" 
            placeholder="Price per Hour" 
            value={formData.price_per_hour} 
            onChange={handleChange} 
            className="input" 
            required
            min="0"
            step="0.01"
            disabled={isSubmitting}
          />
          {errors.price_per_hour && <p className="error">{errors.price_per_hour}</p>}

          <input 
            type="number" 
            name="number_of_spots" 
            placeholder="Total Number of Spots" 
            value={formData.number_of_spots} 
            onChange={handleChange} 
            className="input" 
            required
            min="1"
            disabled={isSubmitting}
          />
          {errors.number_of_spots && <p className="error">{errors.number_of_spots}</p>}

          <input 
            type="number" 
            name="block_duration_hours" 
            placeholder="Block Duration Hours" 
            value={formData.block_duration_hours} 
            onChange={handleChange} 
            className="input" 
            required
            min="1"
            disabled={isSubmitting}
          />
          {errors.block_duration_hours && <p className="error">{errors.block_duration_hours}</p>}

          <input 
            type="number" 
            name="reservation_grace_period" 
            placeholder="Reservation Grace Period (minutes)" 
            value={formData.reservation_grace_period} 
            onChange={handleChange} 
            className="input" 
            required
            min="1"
            disabled={isSubmitting}
          />
          {errors.reservation_grace_period && <p className="error">{errors.reservation_grace_period}</p>}

          <input 
            type="file" 
            name="image" 
            onChange={handleChange} 
            className="input"
            accept="image/*"
            disabled={isSubmitting}
          />
          {errors.image && <p className="error">{errors.image}</p>}

          {/* Contract Document Upload Field */}
          <div>
            <label htmlFor="contract_document" className="block text-sm font-medium mb-2">
              Contract Document * (PDF, DOC, DOCX, JPG, JPEG, PNG - Max 10MB)
            </label>
            <input 
              type="file" 
              name="contract_document" 
              id="contract_document"
              onChange={handleChange} 
              className="input"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
              required
              disabled={isSubmitting}
            />
            {errors.contract_document && <p className="error">{errors.contract_document}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Please upload your garage contract document or image. This will be reviewed by our admin team as part of the verification process.
            </p>
          </div>

          <button 
            type="submit" 
            className={`button ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting for Review...' : 'Submit for Review'}
          </button>
          
          {isSubmitting && (
            <p className="text-sm text-center text-gray-600 mt-2">
              Please wait while we process your registration...
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default GarageRegister;
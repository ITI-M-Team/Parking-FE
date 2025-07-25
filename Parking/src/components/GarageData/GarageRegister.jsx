import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../apis/config";
import bgImage from "../../assets/images/background-home.png";
import "../../PasswordResetFlow/styles/PasswordResetFlow.css";
import "../../assets/css/GarageRegister.css"; // Import the external CSS file

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
  const [currentStep, setCurrentStep] = useState(1);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Read JWT token from sessionStorage
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
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

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
    
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return "Contract document size cannot exceed 10MB.";
    }
    
    return null;
  };

  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    setGettingLocation(true);
    
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
        } finally {
          setGettingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        alert("Location access denied.");
        setGettingLocation(false);
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
        setTimeout(() => {
          navigate("/dashboard/owner");
        }, 3000);
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setErrors(err.response?.data || {});
      
      const errorMessage = err.response?.data?.detail || "Garage registration failed.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message component
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white shadow-2xl p-8 text-center animate-fade-in rounded-3xl">
          <div className="mb-6">
            <div className="text-8xl mb-6 animate-bounce">✅</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Registration Submitted Successfully!
            </h2>
          </div>
          
          <div className="space-y-6 text-left">
            <p className="text-lg text-gray-700">
              Your garage registration has been submitted and is now <strong className="text-blue-600">under review</strong> by our admin team.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-l-4 border-blue-500">
              <h3 className="font-bold mb-3 text-blue-800">What happens next?</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li>Our team will review your garage information and contract document</li>
                <li>This process typically takes 1-3 business days</li>
                <li>You'll receive an email notification once the review is complete</li>
                <li>If approved, your garage will be available for booking by drivers</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border-l-4 border-yellow-500">
              <p className="text-sm text-gray-700">
                <strong className="text-yellow-800">📧 Email Sent:</strong> We've sent a confirmation email to your registered email address with more details about the verification process.
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to dashboard in a few seconds...
            </p>
            <button 
              onClick={() => navigate("/dashboard/owner")} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Go to Dashboard Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      {/* Dark mode toggle */}
      <div className="fixed top-6 right-6 z-20">
        <button 
          onClick={toggleDarkMode}
          className="bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Main Form Container */}
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Register Your Garage
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-white' : 'text-gray-600'}`}>
            Join our network of trusted parking providers and start earning today
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : `${darkMode ? 'bg-white text-gray-500' : 'bg-gray-200 text-gray-500'}`
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-500' : `${darkMode ? 'bg-white' : 'bg-gray-200'}`
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-8 text-sm font-medium">
            <span className={currentStep >= 1 ? 'text-blue-600' : `${darkMode ? 'text-white' : 'text-gray-500'}`}>
              Basic Info
            </span>
            <span className={currentStep >= 2 ? 'text-blue-600' : `${darkMode ? 'text-white' : 'text-gray-500'}`}>
              Configuration
            </span>
            <span className={currentStep >= 3 ? 'text-blue-600' : `${darkMode ? 'text-white' : 'text-gray-500'}`}>
              Documents
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-slide-up">
          {/* Notice Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📋</div>
              <div>
                <h3 className="font-bold text-blue-800 mb-2">Verification Process</h3>
                <p className="text-sm text-blue-700">
                  All garage registrations are reviewed by our admin team before approval. You'll receive an email notification once your garage is verified.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Garage Name *
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Enter garage name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-300 placeholder-gray-500"
                    required
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.name}</p>}
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address *
                  </label>
                  <div className="flex space-x-3">
                    <input 
                      type="text" 
                      name="address" 
                      placeholder="Enter garage address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-300 placeholder-gray-500"
                      required
                      disabled={isSubmitting}
                    />
                    <button 
                      type="button" 
                      onClick={handleUseLocation} 
                      disabled={isSubmitting || gettingLocation}
                      className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      {gettingLocation ? (
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        "📍"
                      )}
                    </button>
                  </div>
                  {errors.address && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Latitude *
                    </label>
                    <input 
                      type="text" 
                      name="latitude" 
                      placeholder="0.000000" 
                      value={formData.latitude} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-300 placeholder-gray-500"
                      required
                      disabled={isSubmitting}
                    />
                    {errors.latitude && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.latitude}</p>}
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Longitude *
                    </label>
                    <input 
                      type="text" 
                      name="longitude" 
                      placeholder="0.000000" 
                      value={formData.longitude} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-300 placeholder-gray-500"
                      required
                      disabled={isSubmitting}
                    />
                    {errors.longitude && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.longitude}</p>}
                  </div>
                </div>
              </div>

              {/* Step 2: Operating Hours & Configuration */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Opening Hour *
                    </label>
                    <input 
                      type="time" 
                      name="opening_hour" 
                      value={formData.opening_hour} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-300"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Closing Hour *
                    </label>
                    <input 
                      type="time" 
                      name="closing_hour" 
                      value={formData.closing_hour} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-300"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price per Hour ($) *
                    </label>
                    <input 
                      type="number" 
                      name="price_per_hour" 
                      placeholder="0.00" 
                      value={formData.price_per_hour} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-300 placeholder-gray-500"
                      required
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                    />
                    {errors.price_per_hour && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.price_per_hour}</p>}
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Spots *
                    </label>
                    <input 
                      type="number" 
                      name="number_of_spots" 
                      placeholder="10" 
                      value={formData.number_of_spots} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-300 placeholder-gray-500"
                      required
                      min="1"
                      disabled={isSubmitting}
                    />
                    {errors.number_of_spots && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.number_of_spots}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Block Duration (Hours) *
                    </label>
                    <input 
                      type="number" 
                      name="block_duration_hours" 
                      placeholder="2" 
                      value={formData.block_duration_hours} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-300 placeholder-gray-500"
                      required
                      min="1"
                      disabled={isSubmitting}
                    />
                    {errors.block_duration_hours && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.block_duration_hours}</p>}
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Grace Period (Minutes) *
                    </label>
                    <input 
                      type="number" 
                      name="reservation_grace_period" 
                      placeholder="15" 
                      value={formData.reservation_grace_period} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-300 placeholder-gray-500"
                      required
                      min="1"
                      disabled={isSubmitting}
                    />
                    {errors.reservation_grace_period && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.reservation_grace_period}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: File Uploads */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Upload Documents</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Garage Image (Optional)
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      name="image" 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-300"                      accept="image/*"
                      disabled={isSubmitting}
                    />
                    <div className="absolute top-3 right-3 text-gray-400">
                      📷
                    </div>
                  </div>
                  {errors.image && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.image}</p>}
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contract Document *
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      name="contract_document" 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-300"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="absolute top-3 right-3 text-gray-400">
                      📄
                    </div>
                  </div>
                  {errors.contract_document && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.contract_document}</p>}
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX, JPG, JPEG, PNG - Max 10MB. This document will be reviewed by our admin team.
                  </p>
                </div>
              </div>
            </div>
              {/* Submit Button */}
            <div className="pt-8 border-t border-gray-200">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Submitting for Review...</span>
                  </div>
                ) : (
                  <span> Submit for Review</span>
                )}
              </button>
              
              {isSubmitting && (
                <p className="text-center text-gray-500 mt-4 animate-pulse">
                  Please wait while we process your registration...
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
      );
};

export default GarageRegister;
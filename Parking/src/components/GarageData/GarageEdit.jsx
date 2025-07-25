
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../apis/config";
import "../../PasswordResetFlow/styles/PasswordResetFlow.css";

const GarageEdit = ({ darkMode, setDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [currentContractUrl, setCurrentContractUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);

  let token = null;
  try {
    const authTokens = JSON.parse(sessionStorage.getItem("authTokens"));
    token = authTokens?.access;
  } catch {
    console.warn("Token not found");
  }

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
          contract_document: null,
        });
        setOriginalSpotCount(data.parking_spots?.length || 0);
        setCurrentImageUrl(data.image || "");
        setCurrentContractUrl(data.contract_document || "");
        setIsLoading(false);
      })
      .catch((err) => {
        alert("❌ Failed to load garage data");
        console.error(err);
        setIsLoading(false);
      });
  }, [id]);

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

  const validateContractFile = (file) => {
    if (!file) return null; // Contract document is optional for updates
    
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

    const newSpotCount = parseInt(formData.number_of_spots, 10);
    if (newSpotCount < originalSpotCount) {
      const confirm = window.confirm(
        `⚠️ You are reducing the number of spots from ${originalSpotCount} to ${newSpotCount}. This will delete available spots. Proceed?`
      );
      if (!confirm) {
        setIsSubmitting(false);
        return;
      }
    }

    // Validate contract document if a new one is being uploaded
    const contractError = validateContractFile(formData.contract_document);
    if (contractError) {
      setErrors({ contract_document: contractError });
      alert(contractError);
      setIsSubmitting(false);
      return;
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      } flex items-center justify-center`}>
        <div className={`rounded-3xl shadow-2xl p-8 text-center transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-100' : 'text-gray-600'}`}>
            Loading garage data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Main Form Container */}
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent'
          }`}>
            Edit Your Garage
          </h1>
          <p className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${
            darkMode ? 'text-gray-100' : 'text-gray-600'
          }`}>
            Update your garage information and settings
          </p>
        </div>

        {/* Form Card */}
        <div className={`rounded-3xl shadow-2xl p-8 md:p-12 animate-slide-up transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          {/* Notice Banner */}
          <div className={`border rounded-2xl p-6 mb-8 transition-colors duration-300 ${
            darkMode 
              ? 'bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border-yellow-600' 
              : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
          }`}>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className={`font-bold mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-yellow-200' : 'text-yellow-800'
                }`}>
                  Important Notice
                </h3>
                <p className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-yellow-100' : 'text-yellow-700'
                }`}>
                  Reducing the number of parking spots will permanently delete the excess spots. Make sure no active bookings exist for those spots.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="form-group">
                  <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                    darkMode ? 'text-gray-100' : 'text-gray-700'
                  }`}>
                    Garage Name *
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Enter garage name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    required
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.name}</p>}
                </div>

                <div className="form-group">
                  <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                    darkMode ? 'text-gray-100' : 'text-gray-700'
                  }`}>
                    Address *
                  </label>
                  <div className="flex space-x-3">
                    <input 
                      type="text" 
                      name="address" 
                      placeholder="Enter garage address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
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
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                      darkMode ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      Latitude *
                    </label>
                    <input 
                      type="text" 
                      name="latitude" 
                      placeholder="0.000000" 
                      value={formData.latitude} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.latitude && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.latitude}</p>}
                  </div>

                  <div className="form-group">
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                      darkMode ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      Longitude *
                    </label>
                    <input 
                      type="text" 
                      name="longitude" 
                      placeholder="0.000000" 
                      value={formData.longitude} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.longitude && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.longitude}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Operating Hours & Configuration */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                      darkMode ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      Opening Hour *
                    </label>
                    <input 
                      type="time" 
                      name="opening_hour" 
                      value={formData.opening_hour} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                      darkMode ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      Closing Hour *
                    </label>
                    <input 
                      type="time" 
                      name="closing_hour" 
                      value={formData.closing_hour} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                      darkMode ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      Price per Hour ($) *
                    </label>
                    <input 
                      type="number" 
                      name="price_per_hour" 
                      placeholder="0.00" 
                      value={formData.price_per_hour} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
                      required
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                    />
                    {errors.price_per_hour && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.price_per_hour}</p>}
                  </div>

                  <div className="form-group">
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                      darkMode ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                      Grace Period (Minutes) *
                    </label>
                    <input 
                      type="number" 
                      name="reservation_grace_period" 
                      placeholder="15" 
                      value={formData.reservation_grace_period} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
                      required
                      min="1"
                      disabled={isSubmitting}
                    />
                    {errors.reservation_grace_period && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.reservation_grace_period}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                    darkMode ? 'text-gray-100' : 'text-gray-700'
                  }`}>
                    Number of Spots *
                  </label>
                  <input 
                    type="number" 
                    name="number_of_spots" 
                    placeholder="10" 
                    value={formData.number_of_spots} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    required
                    min="1"
                    disabled={isSubmitting}
                  />
                  {errors.number_of_spots && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.number_of_spots}</p>}
                  <p className={`text-xs mt-1 transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Current spots: {originalSpotCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: File Uploads */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Update Documents</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Garage Image (Optional)
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      name="image" 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                      accept="image/*"
                      disabled={isSubmitting}
                    />
                    <div className="absolute top-3 right-3 text-gray-400">
                      📷
                    </div>
                  </div>
                  {currentImageUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current image:</p>
                      <img 
                        src={currentImageUrl} 
                        alt="Current Garage" 
                        className="w-32 h-32 object-cover rounded-xl shadow-md border border-gray-200 dark:border-gray-700" 
                      />
                    </div>
                  )}
                  {errors.image && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.image}</p>}
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Contract Document (Optional)
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      name="contract_document" 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
                      disabled={isSubmitting}
                    />
                    <div className="absolute top-3 right-3 text-gray-400">
                      📄
                    </div>
                  </div>
                  {currentContractUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current contract document uploaded</p>
                      <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                        <span>📄</span>
                        <span>Contract document exists</span>
                      </div>
                    </div>
                  )}
                  {errors.contract_document && <p className="text-red-500 text-sm mt-1 animate-shake">{errors.contract_document}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    PDF, DOC, DOCX, JPG, JPEG, PNG - Max 10MB. Leave empty to keep current document.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  type="button"
                  onClick={() => navigate("/dashboard/owner")} 
                  className="flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl bg-gray-500 hover:bg-gray-600 text-white"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <span>💾 Save Changes</span>
                  )}
                </button>
              </div>
              
              {isSubmitting && (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-4 animate-pulse">
                  Please wait while we update your garage information...
                </p>
              )}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default GarageEdit;


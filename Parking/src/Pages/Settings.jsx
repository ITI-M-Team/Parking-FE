import React from 'react'
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Upload, Eye, EyeOff, Plus } from 'lucide-react';
import instance from "../apis/config.js"
const Settings = ({ darkMode, setDarkMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    national_id: '',
    newPassword: '',
    confirmPassword: '',
    vehiclePlate: '',
    vehicleType: 'Car'
  });
  // ??First load Current user Data
    useEffect(() => {
      loadUserData();
    }, []);
    const loadUserData = async () => {
    const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
    const token = storedToken ? JSON.parse(storedToken).access : null;
    try {
      const res = await instance.get('/user-info/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFormData(prev => ({
        ...prev,
        username: res.data.username || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        national_id: res.data.national_id || ''
      }));
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };
  /// End Loaded user data 
  /// handle new fields Updates
  const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  ///End of handle save updates
  
  const handleSaveChanges = async() => {
    const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
    const token = storedToken ? JSON.parse(storedToken).access : null;
    const formDataToSend = new FormData();
    const fieldsToUpdate = ['username', 'email', 'phone', 'national_id'];
    fieldsToUpdate.forEach(field => {
      if (formData[field]) {
        formDataToSend.append(field, formData[field]);
      }
    });

    // Add profile image if selected
    if (profileImage && typeof profileImage !== 'string') {
      formDataToSend.append('national_id_img', profileImage);
    }
     try {
      const res = await instance.put('/user-info/', formDataToSend, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
      alert("Profile updated successfully!");
      console.log('Saving changes:', formDataToSend);
    } catch (err) {
    console.error(err);
    alert("Update failed!"+(err.response?.data?.message || err.message));
  }
  };
  // Password aheck then change then appand at form data 
  const handleChangePassword = async () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      alert('Please fill in both password fields');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
    const token = storedToken ? JSON.parse(storedToken).access : null;
    const passwordData = new FormData();
    passwordData.append('new_password', formData.newPassword);
    passwordData.append('confirm_password', formData.confirmPassword);
    try {
      const res = await instance.put('/user-info/', passwordData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Password updated successfully!");
      setFormData({ ...formData, newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      alert("Password update failed: " + (err.response?.data?.message || err.message));
    }
  }

  const handleAddVehicle = () => {
    if (formData.vehiclePlate) {
      console.log('Adding vehicle:', formData.vehiclePlate, formData.vehicleType);

      setFormData({ ...formData, vehiclePlate: '' });
    }
  };
//   Upload Image
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImage(e.target.result);
        };
        reader.readAsDataURL(file);
        console.log('Image uploaded:', file.name);
        // Add your image upload logic here
        }
    };

    const triggerFileInput = () => {
        document.getElementById('imageUpload').click();
    };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`shadow-sm border-b px-6 py-4 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className={`text-xl font-semibold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>Update Profile</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 text-sm rounded-md transition hover:scale-105 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900'}`}
            >
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
            <span className={`text-sm transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formData?.username || 'User'}</span>
            <Link to={"/profile"}>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{formData?.username ? formData.username.charAt(0).toUpperCase() : 'U'}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className={`rounded-lg shadow-sm transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Profile Section */}
          <div className={`p-8 border-b transition-colors ${darkMode ? 'border-gray-700' : ''}`}>
            <div className="flex flex-col items-center space-y-4">
              {/* Image Change */}
             <div className="relative">
                {"" ? (
                  <img 
                    src="" 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-black rounded-full mb-2"></div>
                    <div className="w-6 h-6 bg-black rounded-full mb-2 ml-4"></div>
                    <div className="w-16 h-8 bg-black rounded-full"></div>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <button 
                onClick={triggerFileInput}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload new image</span>
              </button>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 space-y-8">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                  placeholder="Enter your email"
                />
              </div>

               <div>
                <label className={`block text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>National ID</label>
                <input
                  type="text"
                  name="national_id"
                  value={formData.national_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                  placeholder="Enter your National ID"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>

            {/* Password Section */}
            <div className={`border-t pt-8 transition-colors ${darkMode ? 'border-gray-700' : ''}`}>
              <h3 className={`text-lg font-semibold mb-6 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>Change your password</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>New password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm new password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleChangePassword}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Vehicles Section */}
            <div className={`border-t pt-8 transition-colors ${darkMode ? 'border-gray-700' : ''}`}>
              <h3 className={`text-lg font-semibold mb-2 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>Vehicles</h3>
              <p className={`text-sm mb-6 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Select your default vehicle registration plate</p>
              
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      name="vehiclePlate"
                      value={formData.vehiclePlate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                      placeholder="Add your vehicle's registration plate"
                    />
                  </div>
                  
                  <div className="w-32">
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                    >
                      <option value="Car">Car</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Truck">Truck</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={handleAddVehicle}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Settings
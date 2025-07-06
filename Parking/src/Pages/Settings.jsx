import React from 'react'
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Upload, Eye, EyeOff, Plus, FileText, CheckCircle, XCircle, Clock, AlertCircle, Camera   } from 'lucide-react';
import instance from "../apis/config.js"
const Settings = ({ darkMode, setDarkMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [userRole, setUserRole] = useState('driver');
  const [verificationStatus, setVerificationStatus] = useState('Pending');
  const [documents, setDocuments] = useState({
    driver_license: null,
    car_license: null,
    national_id_img: null
  });
   const [documentFiles, setDocumentFiles] = useState({
    driver_license: null,
    car_license: null,
    national_id_img: null
  });
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
      setUserRole(res.data.role || '');
      setVerificationStatus(res.data.verification_status || 'Pending');
      setDocuments({
        driver_license: res.data.driver_license || null,
        car_license: res.data.car_license || null,
        national_id_img: res.data.national_id_img || null
      });
      // Set profile image if exists
      if (res.data.profile_image) {
        setProfileImagePreview(res.data.profile_image);
      }

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
      formDataToSend.append('profile_image', profileImage);
    }
     try {
      const res = await instance.put('/user-info/', formDataToSend, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
      alert("Profile updated successfully!");
      await loadUserData();
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
          setProfileImage(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setProfileImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
        console.log('Image uploaded:', file.name);
        // 
        }
    };

  

/////////////////////////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\
    // Handle documents upload for review
    const handleDocumentUpload = (event, documentType) => {
    const file = event.target.files[0];
    if (file) {
      setDocumentFiles(prev => ({
        ...prev,
        [documentType]: file
      }));
      console.log(`${documentType} uploaded:`, file.name);
    }
  };



  // Submit documents for verification

   const handleSubmitDocuments = async () => {
    const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
    const token = storedToken ? JSON.parse(storedToken).access : null;
    const formDataToSend = new FormData();
    
    // Add documents to form data
    Object.keys(documentFiles).forEach(key => {
      if (documentFiles[key]) {
        formDataToSend.append(key, documentFiles[key]);
      }
    });
    //this is a re-submission for rejected status
    if (verificationStatus === 'Rejected') {
      formDataToSend.append('resubmission', 'true');
    }

    try {
      const res = await instance.put('/user-info/', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      //Different success messages based on status
      if (verificationStatus === 'Rejected') {
        alert("Documents resubmitted successfully! Your verification status has been reset to Pending.");
      } else {
        alert("Documents submitted successfully! Please wait for admin review.");
      }
       setDocumentFiles({
        driver_license: null,
        car_license: null,
        national_id_img: null
      });
      await loadUserData();
    } catch (err) {
      console.error(err);
      alert("Document submission failed: " + (err.response?.data?.message || err.message));
    }
  };

  const triggerFileInput = () => {
    document.getElementById('imageUpload').click();
  };
  const triggerDocumentInput = (documentType) => {
    document.getElementById(`${documentType}Upload`).click();
  };

  // Get verification status icon and color
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'text-green-500';
      case 'Rejected':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const needsDocuments = () => {
    const missingDocs = !documents.driver_license || !documents.car_license || !documents.national_id_img;
    // return !documents.driver_license || !documents.car_license || !documents.national_id_img;
    return verificationStatus === 'Rejected' || missingDocs;
  };

   // Helper function to check if document can be uploaded
  const canUploadDocument = (documentType) => {
    // If status is rejected, allow re-upload even if document exists
    if (verificationStatus === 'Rejected') {
      return true;
    }
    // Otherwise, only allow upload if document doesn't exist
    return !documents[documentType];
  };
  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`shadow-sm border-b px-6 py-4 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link className="p-2 hover:bg-gray-100 rounded-lg" to={"/profile"}>   
              <ChevronLeft className={`w-5 h-5 ${darkMode ? 'text-white ' : 'text-gray-900'}`} />
           </Link>
            <h1 className={`text-xl font-semibold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>Update Profile</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-3 sm:space-y-0 text-center sm:text-left">
            <div className="flex items-center space-x-2">
              {getStatusIcon(verificationStatus)}
              <span className={` text-xs sm:text-sm font-medium ${getStatusColor(verificationStatus)}`}>
                {verificationStatus}
              </span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2  text-xs sm:text-sm rounded-md transition hover:scale-105 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900'}`}
            >
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
            <span className={` text-xs sm:text-sm transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formData?.username || 'User'}</span>
            <Link to="/profile">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-white shadow"
                />
                ) : (
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white  text-xs sm:text-sm font-medium">
                    {formData?.username ? formData.username.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className={`rounded-lg shadow-sm transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Profile Section */}
          <div className={`p-8 border-b transition-colors ${darkMode ? 'border-gray-700' : ''}`}>
            <div className="flex flex-col items-center space-y-4">
              {/* Image Change */}
             <div className="relative">
                {profileImagePreview ? (
                  <img 
                    src={profileImagePreview} 
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
                <label className={`block  text-xs sm:text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
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
                <label className={`block  text-xs sm:text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
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
                <label className={`block  text-xs sm:text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>National ID</label>
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
                <label className={`block  text-xs sm:text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone number</label>
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
                  <label className={`block  text-xs sm:text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>New password</label>
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
                  <label className={`block  text-xs sm:text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm new password</label>
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
            {/* Documentation Section */}
            {/* -------------------------------------------------------------------- */}
               {needsDocuments() && (
              <div className={`border-t pt-8 transition-colors ${darkMode ? 'border-gray-700' : ''}`}>
                <h3 className={`text-lg font-semibold mb-2 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>Required Documents</h3>
                <p className={` text-xs sm:text-sm mb-6 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Please upload the following documents for verification. They will be reviewed by admin.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Driver License */}
                <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <FileText className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Driver License</h4>
                    </div>
                    {canUploadDocument('driver_license') ? (
                      <>
                        <input
                          type="file"
                          id="driver_licenseUpload"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload(e, 'driver_license')}
                          className="hidden"
                        />
                        <button
                          onClick={() => triggerDocumentInput('driver_license')}
                          className={`w-full px-4 py-2 border-2 border-dashed rounded-lg transition-colors ${darkMode ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                        >
                          {documentFiles.driver_license ? documentFiles.driver_license.name : 
                            (verificationStatus === 'Rejected' ? 'Upload New Driver License' : 'Upload Driver License')}
                        </button>
                      </>
                      ) : (
                        <div className="text-green-500 text-xs sm:text-sm">✓ Already uploaded</div>
                      )}
                  </div>

                  {/* Car License */}
                  <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <FileText className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Car License</h4>
                    </div>
                    {canUploadDocument('car_license') ? (
                      <>
                        <input
                          type="file"
                          id="car_licenseUpload"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload(e, 'car_license')}
                          className="hidden"
                        />
                        <button
                          onClick={() => triggerDocumentInput('car_license')}
                          className={`w-full px-4 py-2 border-2 border-dashed rounded-lg transition-colors ${darkMode ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                        >
                          {documentFiles.car_license ? documentFiles.car_license.name : 
                            (verificationStatus === 'Rejected' ? 'Upload New Car License' : 'Upload Car License')}
                        </button>
                      </>
                    ) : (
                      <div className="text-green-500 text-xs sm:text-sm">✓ Already uploaded</div>
                    )}
                  </div>

                  {/* National ID Image */}
                  <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <FileText className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>National ID Image</h4>
                    </div>
                    {canUploadDocument('national_id_img') ? (
                      <>
                        <input
                          type="file"
                          id="national_id_imgUpload"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload(e, 'national_id_img')}
                          className="hidden"
                        />
                        <button
                          onClick={() => triggerDocumentInput('national_id_img')}
                          className={`w-full px-4 py-2 border-2 border-dashed rounded-lg transition-colors ${darkMode ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                        >
                          {documentFiles.national_id_img ? documentFiles.national_id_img.name : 
                            (verificationStatus === 'Rejected' ? 'Upload New National ID' : 'Upload National ID')}
                        </button>
                      </>
                    ) : (
                      <div className="text-green-500 text-xs sm:text-sm">✓ Already uploaded</div>
                    )}
                  </div>
                </div>

                {/* Submit Documents Button */}
                 {(documentFiles.driver_license || documentFiles.car_license || documentFiles.national_id_img) && (
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSubmitDocuments}
                      className={`px-6 py-3 text-white rounded-lg transition-colors font-medium ${
                        verificationStatus === 'Rejected' 
                          ? 'bg-orange-600 hover:bg-orange-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {verificationStatus === 'Rejected' ? 'Resubmit Documents' : 'Submit Documents for Review'}
                    </button>
                  </div>
                )}
              </div>
            )}


          
            {/* ---------------------------------------------------------------------- */}
            {/* Vehicles Section */}
       {userRole === 'driver' && (
              <div className={`border-t pt-8 transition-colors ${darkMode ? 'border-gray-700' : ''}`}>
                <h3 className={`text-lg font-semibold mb-2 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>Vehicles</h3>
                <p className={` text-xs sm:text-sm mb-6 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Select your default vehicle registration plate</p>
                
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Settings
import React, { useEffect, useState } from 'react'
import hossam from '../assets/images/hossam.jpg'
import { ChevronLeft, User, Mail, Phone, CreditCard, FileText, Car, AlertCircle, Loader } from 'lucide-react';
import { Link,useNavigate } from "react-router-dom";
import instance from "../apis/config.js"
// import instance from '../apis/config';
function Profile({ darkMode, setDarkMode }) {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate()
    useEffect(() => {
        fetchUserInfo();
    }, []);
    ///Get user info and get token and check from errors !
    const fetchUserInfo = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get token from storage
      const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
      const token = storedToken ? JSON.parse(storedToken).access : null;
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      // Make request to get user info
      const response = await instance.get('/user-info/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setUserInfo(response.data);
    } catch (err) {
      console.error('Error fetching user info:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        // Clear invalid token
        localStorage.removeItem('authTokens');
        sessionStorage.removeItem('authTokens');
      } else {
        setError('Failed to fetch user information. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
    const handleRetry = () => {
        fetchUserInfo();
    };
    const handleUpdate = () => {
        navigate("/settings");
    };
  //Handle loading if no data
   if (loading) {
    return (
      <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader className={`w-12 h-12 animate-spin mx-auto mb-4 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading user information...</p>
          </div>
        </div>
      </div>
    );
  }
  //Handle errors 
  if (error) {
  return (
      <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Error</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
    }

  return (
     <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`shadow-sm border-b px-6 py-4 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className={`text-xl font-semibold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>User Information</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 text-sm rounded-md transition hover:scale-105 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900'}`}
            >
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
            <span className={`text-sm transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{userInfo?.username || 'User'}</span>
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userInfo?.username ? userInfo.username.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className={`rounded-lg shadow-sm transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Profile Section */}
          <div className={`p-8 border-b transition-colors ${darkMode ? 'border-gray-700' : ''}`}>
            <div className="flex flex-col items-center space-y-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              <div className="text-center">
                <h2 className={`text-2xl font-bold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userInfo?.username || 'Unknown User'}
                </h2>
                <p className={`text-sm transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {userInfo?.role || 'User'}
                </p>
              </div>
            </div>
          </div>

          {/* User Information Section */}
          <div className="p-8 space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className={`text-lg font-semibold mb-6 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</p>
                    <p className={`text-lg transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userInfo?.username || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</p>
                    <p className={`text-lg transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userInfo?.email || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone</p>
                    <p className={`text-lg transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userInfo?.phone || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>National ID</p>
                    <p className={`text-lg transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userInfo?.national_id || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</p>
                    <p className={`text-lg transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userInfo?.role || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className={`border-t pt-8 transition-colors ${darkMode ? 'border-gray-700' : ''}`}>
              <h3 className={`text-lg font-semibold mb-6 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Documents
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-lg border-2 border-dashed transition-colors ${
                  userInfo?.driver_license 
                    ? (darkMode ? 'border-green-600 bg-green-900/20' : 'border-green-300 bg-green-50') 
                    : (darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50')
                }`}>
                  <div className="text-center">
                    <Car className={`w-12 h-12 mx-auto mb-3 ${
                      userInfo?.driver_license 
                        ? (darkMode ? 'text-green-400' : 'text-green-600') 
                        : (darkMode ? 'text-gray-500' : 'text-gray-400')
                    }`} />
                    <h4 className={`font-medium mb-2 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Driver License
                    </h4>
                    {userInfo?.driver_license ? (
                      <a 
                        href={userInfo.driver_license} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm underline"
                      >
                        View Document
                      </a>
                    ) : (
                      <p className={`text-sm transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Not uploaded
                      </p>
                    )}
                  </div>
                </div>

                <div className={`p-6 rounded-lg border-2 border-dashed transition-colors ${
                  userInfo?.car_license 
                    ? (darkMode ? 'border-green-600 bg-green-900/20' : 'border-green-300 bg-green-50') 
                    : (darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50')
                }`}>
                  <div className="text-center">
                    <FileText className={`w-12 h-12 mx-auto mb-3 ${
                      userInfo?.car_license 
                        ? (darkMode ? 'text-green-400' : 'text-green-600') 
                        : (darkMode ? 'text-gray-500' : 'text-gray-400')
                    }`} />
                    <h4 className={`font-medium mb-2 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Car License
                    </h4>
                    {userInfo?.car_license ? (
                      <a 
                        href={userInfo.car_license} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm underline"
                      >
                        View Document
                      </a>
                    ) : (
                      <p className={`text-sm transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Not uploaded
                      </p>
                    )}
                  </div>
                </div>

                <div className={`p-6 rounded-lg border-2 border-dashed transition-colors ${
                  userInfo?.national_id_img 
                    ? (darkMode ? 'border-green-600 bg-green-900/20' : 'border-green-300 bg-green-50') 
                    : (darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50')
                }`}>
                  <div className="text-center">
                    <CreditCard className={`w-12 h-12 mx-auto mb-3 ${
                      userInfo?.national_id_img 
                        ? (darkMode ? 'text-green-400' : 'text-green-600') 
                        : (darkMode ? 'text-gray-500' : 'text-gray-400')
                    }`} />
                    <h4 className={`font-medium mb-2 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      National ID Image
                    </h4>
                    {userInfo?.national_id_img ? (
                      <a 
                        href={userInfo.national_id_img} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm underline"
                      >
                        View Document
                      </a>
                    ) : (
                      <p className={`text-sm transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Not uploaded
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center pt-6 space-x-4 flex-wrap">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Refresh Information
              </button>
               <button
                onClick={handleUpdate}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Update Information
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Profile
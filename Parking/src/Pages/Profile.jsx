import React, { useEffect, useState } from 'react';
import { ChevronLeft, User, Mail, Phone, CreditCard, FileText, Car, AlertCircle, Loader } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import instance from "../apis/config.js";
import { useLanguage } from '../context/LanguageContext'; 

function Profile({ darkMode, setDarkMode }) {
  const { language } = useLanguage(); 

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  const t = {
    en: {
      title: "User Information",
      username: "Username",
      email: "Email",
      phone: "Phone",
      nationalId: "National ID",
      role: "Role",
      documents: "Documents",
      driverLicense: "Driver License",
      carLicense: "Car License",
      nationalIdImage: "National ID Image",
      viewDocument: "View Document",
      notUploaded: "Not uploaded",
      refresh: "Refresh Information",
      update: "Update Information",
      error: "Error",
      tryAgain: "Try Again",
      loading: "Loading user information...",
      noData: "Not provided",
      walletBalance: "Wallet Balance"
    },
    ar: {
      title: "معلومات المستخدم",
      username: "اسم المستخدم",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      nationalId: "الرقم القومي",
      role: "الدور",
      documents: "الوثائق",
      driverLicense: "رخصة القيادة",
      carLicense: "رخصة السيارة",
      nationalIdImage: "صورة الهوية",
      viewDocument: "عرض الوثيقة",
      notUploaded: "لم تُرفع",
      refresh: "تحديث المعلومات",
      update: "تحديث البيانات",
      error: "حدث خطأ",
      tryAgain: "حاول مجددًا",
      loading: "جاري تحميل معلومات المستخدم...",
      noData: "غير متوفر",
      walletBalance: "رصيد المحفظة"
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      setError('');
      const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
      const token = storedToken ? JSON.parse(storedToken).access : null;
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      const response = await instance.get('/user-info/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setUserInfo(response.data);
    } catch (err) {
      console.error('Error fetching user info:', err);
      if (err.response?.status === 401) {
        setError('فشل التحقق. يرجى تسجيل الدخول مجددًا.');
      } else {
        setError('فشل تحميل معلومات المستخدم. يرجى المحاولة مجددًا.');
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

  // Handle loading state
  if (loading) {
    return (
      <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader className={`w-12 h-12 animate-spin mx-auto mb-4 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t[language].loading}</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t[language].error}</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t[language].tryAgain}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        <div className={`rounded-lg shadow-sm transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Profile Section */}
          <div className={`p-8 border-b transition-colors ${darkMode ? 'border-gray-700' : ''}`}>
            <div className="flex flex-col items-center space-y-4">
              {/* Avatar */}
              <div className="relative">
                {userInfo?.profile_image ? (
                  <img
                    src={userInfo?.profile_image}
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
              <div className="text-center">
                <h2 className={`text-2xl font-bold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userInfo?.username || t[language].noData}
                </h2>
                <p className={`text-sm transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {userInfo?.role || t[language].noData}
                </p>
              </div>
            </div>
          </div>

          {/* User Information Section */}
          <div className="p-8 space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className={`text-lg font-semibold mb-6 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t[language].title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm font-medium transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t[language].username}
                    </p>
                    <p className={`text-sm sm:text-base md:text-lg transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userInfo?.username || t[language].noData}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm font-medium transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t[language].email}
                    </p>
                    <p className={`text-sm sm:text-base md:text-lg transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userInfo?.email || t[language].noData}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm font-medium transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t[language].phone}
                    </p>
                    <p className={`text-sm sm:text-base md:text-lg transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userInfo?.phone || t[language].noData}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm font-medium transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t[language].nationalId}
                    </p>
                    <p className={`text-sm sm:text-base md:text-lg transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userInfo?.national_id || t[language].noData}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm font-medium transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t[language].role}
                    </p>
                    <p className={`text-sm sm:text-base md:text-lg transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userInfo?.role || t[language].noData}
                    </p>
                  </div>
                </div>
                
                {/* New Wallet Balance Field */}
                {userInfo?.wallet_balance !== undefined && (
                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm font-medium transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t[language].walletBalance}
                      </p>
                      <p className={`text-sm sm:text-base md:text-lg font-bold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {userInfo.wallet_balance.toFixed(2)} EGP
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Documents Section */}
            <div className={`border-t pt-8 transition-colors ${darkMode ? 'border-gray-700' : ''}`}>
              <h3 className={`text-lg font-semibold mb-6 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t[language].documents}
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
                      {t[language].driverLicense}
                    </h4>
                    {userInfo?.driver_license ? (
                      <a 
                        href={userInfo.driver_license} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm underline"
                      >
                        {t[language].viewDocument}
                      </a>
                    ) : (
                      <p className={`text-sm transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t[language].notUploaded}
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
                      {t[language].carLicense}
                    </h4>
                    {userInfo?.car_license ? (
                      <a 
                        href={userInfo.car_license} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm underline"
                      >
                        {t[language].viewDocument}
                      </a>
                    ) : (
                      <p className={`text-sm transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t[language].notUploaded}
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
                      {t[language].nationalIdImage}
                    </h4>
                    {userInfo?.national_id_img ? (
                      <a 
                        href={userInfo.national_id_img} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm underline"
                      >
                        {t[language].viewDocument}
                      </a>
                    ) : (
                      <p className={`text-sm transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t[language].notUploaded}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center pt-6 gap-4">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
              >
                {t[language].refresh}
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
              >
                {t[language].update}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
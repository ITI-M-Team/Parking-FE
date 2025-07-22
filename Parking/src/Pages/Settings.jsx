import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,User,Mail,Phone,CreditCard,FileText,Car,AlertCircle,Loader,Eye,EyeOff,Plus,Camera
} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import instance from "../apis/config.js";
import { useLanguage } from '../context/LanguageContext'; 

function Settings({ darkMode, setDarkMode }) {
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
      phone: "Phone number",
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
      changePassword: "Change your password",
      newPassword: "New password",
      confirmPassword: "Confirm new password",
      changeBtn: "Change Password",
      saveChanges: "Save Changes",
      uploadImage: "Upload new image",
      vehicleSection: "Vehicles",
      addVehicle: "Add your vehicle's registration plate",
      vehicleType: "Vehicle Type",
      car: "Car",
      motorcycle: "Motorcycle",
      truck: "Truck",
      van: "Van",
      add: "Add",
      requiredDocs: "Required Documents",
      docsForVerification: "Please upload the following documents for verification. They will be reviewed by admin.",
      submitDocuments: "Submit Documents for Review",
      resubmitDocuments: "Resubmit Documents"
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
      nationalIdImage: "صورة الهوية الوطنية",
      viewDocument: "عرض الوثيقة",
      notUploaded: "لم تُرفع",
      refresh: "تحديث المعلومات",
      update: "تحديث البيانات",
      error: "حدث خطأ",
      tryAgain: "حاول مجددًا",
      loading: "جاري تحميل معلومات المستخدم...",
      noData: "غير متوفر",
      changePassword: "تغيير كلمة المرور",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور",
      changeBtn: "تغيير كلمة المرور",
      saveChanges: "حفظ التغييرات",
      uploadImage: "تحميل صورة جديدة",
      vehicleSection: "المركبات",
      addVehicle: "أضف لوحة ترخيص المركبة",
      vehicleType: "نوع المركبة",
      car: "سيارة",
      motorcycle: "دراجة",
      truck: "شاحنة",
      van: "ميني فان",
      add: "إضافة",
      requiredDocs: "الوثائق المطلوبة",
      docsForVerification: "يرجى رفع الوثائق التالية للمراجعة. سيتم مراجعتها بواسطة المسؤول.",
      submitDocuments: "تقديم الوثائق للمراجعة",
      resubmitDocuments: "إعادة تقديم الوثائق"
    }
  };

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    national_id: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [documentFiles, setDocumentFiles] = useState({
    driver_license: null,
    car_license: null,
    national_id_img: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [verificationStatus, setVerificationStatus] = useState("Pending"); // يمكن أن يكون: Pending, Approved, Rejected

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
      const data = response.data;
      setUserInfo(data);
      setFormData({
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        national_id: data.national_id || ""
      });
      setVerificationStatus(data.verification_status || "Pending");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDocumentUpload = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFiles(prev => ({ ...prev, [docType]: file }));
    }
  };

  const triggerDocumentInput = (docType) => {
    document.getElementById(`${docType}Upload`).click();
  };

  const canUploadDocument = (docType) => {
    if (verificationStatus === "Approved") return false;
    if (verificationStatus === "Rejected") return true;
    return !documentFiles[docType];
  };

  const handleSaveChanges = () => {
    alert(language === 'ar' ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!');
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert(language === 'ar' ? 'كلمات المرور غير متطابقة!' : 'Passwords do not match!');
      return;
    }
    alert(language === 'ar' ? 'تم تغيير كلمة المرور!' : 'Password changed successfully!');
  };

  const handleSubmitDocuments = () => {
    alert(language === 'ar' ? 'تم تقديم الوثائق للمراجعة!' : 'Documents submitted for review!');
  };

  const handleAddVehicle = () => {
    alert(language === 'ar' ? 'تمت إضافة المركبة!' : 'Vehicle added successfully!');
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
              onClick={fetchUserInfo}
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

          {/* Personal Info Form */}
          <div className="p-8 space-y-8">
            <h3 className={`text-lg font-semibold mb-6 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t[language].title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t[language].username}
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                  placeholder={t[language].username}
                />
              </div>
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t[language].email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                  placeholder={t[language].email}
                />
              </div>
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t[language].phone}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                  placeholder={t[language].phone}
                />
              </div>
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t[language].nationalId}
                </label>
                <input
                  type="text"
                  name="national_id"
                  value={formData.national_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                  placeholder={t[language].nationalId}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t[language].saveChanges}
              </button>
            </div>

            {/* Password Section */}
            <div className={`border-t pt-8 transition-colors ${darkMode ? 'border-gray-700' : ''}`}>
              <h3 className={`text-lg font-semibold mb-6 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t[language].changePassword}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t[language].newPassword}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                      placeholder={t[language].newPassword}
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
                  <label className={`block text-xs sm:text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t[language].confirmPassword}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                      placeholder={t[language].confirmPassword}
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
              <div className="mt-4">
                <button
                  onClick={handleChangePassword}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {t[language].changeBtn}
                </button>
              </div>
            </div>

            {/* Documents Section */}
            <div className={`border-t pt-8 transition-colors ${darkMode ? 'border-gray-700' : ''}`}>
              <h3 className={`text-lg font-semibold mb-6 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t[language].requiredDocs}
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t[language].docsForVerification}
              </p>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {t[language].driverLicense}
                    </h4>
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
                        {documentFiles.driver_license ? documentFiles.driver_license.name : t[language].uploadImage}
                      </button>
                    </>
                  ) : (
                    <div className="text-green-500 text-xs sm:text-sm">✓ {t[language].viewDocument}</div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Car className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {t[language].carLicense}
                    </h4>
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
                        {documentFiles.car_license ? documentFiles.car_license.name : t[language].uploadImage}
                      </button>
                    </>
                  ) : (
                    <div className="text-green-500 text-xs sm:text-sm">✓ {t[language].viewDocument}</div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <CreditCard className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {t[language].nationalIdImage}
                    </h4>
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
                        {documentFiles.national_id_img ? documentFiles.national_id_img.name : (verificationStatus === 'Rejected' ? t[language].resubmitDocuments : t[language].uploadImage)}
                      </button>
                    </>
                  ) : (
                    <div className="text-green-500 text-xs sm:text-sm">✓ {t[language].viewDocument}</div>
                  )}
                </div>
              </div>

              {/* Submit Documents Button */}
              {(documentFiles.driver_license || documentFiles.car_license || documentFiles.national_id_img) && (
                <div className="mt-6">
                  <button
                    onClick={handleSubmitDocuments}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {verificationStatus === 'Rejected' ? t[language].resubmitDocuments : t[language].submitDocuments}
                  </button>
                </div>
              )}
            </div>

            {/* Vehicles Section */}
            <div className={`border-t pt-8 transition-colors ${darkMode ? 'border-gray-700' : ''}`}>
              <h3 className={`text-lg font-semibold mb-6 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t[language].vehicleSection}
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t[language].addVehicle}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex-1">
                  <label className={`block text-xs sm:text-sm font-medium mb-2 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t[language].vehicleType}
                  </label>
                  <select
                    name="vehicle_type"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                  >
                    <option value="Car">{t[language].car}</option>
                    <option value="Motorcycle">{t[language].motorcycle}</option>
                    <option value="Truck">{t[language].truck}</option>
                    <option value="Van">{t[language].van}</option>
                  </select>
                </div>
                <div className="flex items-end">
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

export default Settings;
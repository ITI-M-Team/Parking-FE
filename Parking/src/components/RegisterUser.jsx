import React, { useState } from "react";

const InputField = ({ name, type = "text", placeholder, value, onChange, error, isArabic }) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full border border-gray-300 p-2 rounded ${isArabic ? 'text-right' : 'text-left'}`}
      style={{ direction: isArabic ? 'rtl' : 'ltr' }}
      required
    />
    {error && <p className={`text-red-500 text-sm ${isArabic ? 'text-right' : 'text-left'}`}>{error}</p>}
  </div>
);

const FileInput = ({ label, name, onChange, error, isArabic }) => (
  <div>
    <label className={`block text-sm font-medium text-gray-700 mb-1 ${isArabic ? 'text-right' : 'text-left'}`}>
      {label}
    </label>
    <div className={`w-full border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm bg-white ${isArabic ? 'text-right' : 'text-left'}`}>
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="w-full text-gray-600"
      />
    </div>
    {error && <p className={`text-red-500 text-sm ${isArabic ? 'text-right' : 'text-left'}`}>{error}</p>}
  </div>
);

function RegisterUser() {
  const navigate = (path) => {
    window.location.href = path;
  };

  const [role, setRole] = useState("driver");
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return savedLanguage || 'en';
  });
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('preferredDarkMode');
    return savedDarkMode === 'true';
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    national_id: "",
    driver_license: null,
    car_license: null,
    national_id_img: null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const translations = {
    ar: {
      signUp: 'إنشاء حساب',
      lightMode: '☀ الوضع النهاري',
      darkMode: '🌙 الوضع الليلي',
      chooseRoleAndFill: 'اختر دورك واملأ النموذج',
      driver: 'سائق',
      garageOwner: 'صاحب كراج',
      username: 'اسم المستخدم',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      nationalId: 'الرقم القومي',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      driverLicense: 'رخصة القيادة',
      carLicense: 'رخصة السيارة',
      nationalIdImage: 'صورة الرقم القومي',
      register: 'تسجيل',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      login: 'تسجيل الدخول',
      passwordsDoNotMatch: 'كلمات المرور غير متطابقة.',
      registeredSuccessfully: 'تم التسجيل بنجاح',
      registrationFailed: 'فشل في التسجيل',
      errorOccurred: 'حدث خطأ',
      registering: 'جاري التسجيل...',
      uploadFile: 'اختر ملف',
      noFileChosen: 'لم يتم اختيار ملف'
    },
    en: {
      signUp: 'Sign up',
      lightMode: '☀ Light Mode',
      darkMode: '🌙 Dark Mode',
      chooseRoleAndFill: 'Choose your role and fill the form',
      driver: 'Driver',
      garageOwner: 'Garage Owner',
      username: 'Username',
      email: 'Email',
      phone: 'Phone Number',
      nationalId: 'National ID',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      driverLicense: 'Driver License',
      carLicense: 'Car License',
      nationalIdImage: 'National ID Image',
      register: 'Register',
      alreadyHaveAccount: 'Already have an account?',
      login: 'Login',
      passwordsDoNotMatch: 'Passwords do not match.',
      registeredSuccessfully: 'Registered successfully',
      registrationFailed: 'Registration failed',
      errorOccurred: 'Error occurred',
      registering: 'Registering...',
      uploadFile: 'Choose File',
      noFileChosen: 'No file chosen'
    }
  };

  const t = translations[language];
  const isArabic = language === 'ar';

  const handleLanguageChange = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('preferredDarkMode', newDarkMode.toString());
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: t.passwordsDoNotMatch });
      setIsLoading(false);
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });
    payload.append("role", role);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (res.ok) {
        alert(t.registeredSuccessfully);
        navigate("/login");
      } else {
        setErrors(data);
        // Uncomment if you want to show detailed error messages
        // const messages = Object.values(data).flat().join("\n");
        // alert(t.registrationFailed + ":\n" + messages);
      }
    } catch (err) {
      console.error(err);
      alert(t.errorOccurred);
    } finally {
      setIsLoading(false);
    }
  };

  const containerClasses = `min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`;
  const cardClasses = `w-full max-w-xl rounded-lg shadow-md p-8 m-4 max-h-[90vh] overflow-y-auto ${
    darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
  }`;

  return (
    <div 
      className={containerClasses}
      style={{ 
        direction: isArabic ? 'rtl' : 'ltr',
        fontFamily: isArabic ? '"Cairo", "Tajawal", sans-serif' : 'inherit'
      }}
    >
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} style={{
        backgroundColor: darkMode ? "#2d3748" : "#edf2f7",
        color: darkMode ? "#fff" : "#2d3748",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingInline: "20px",
        padding: "16px 20px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ 
            fontSize: "18px", 
            fontWeight: "bold", 
            color: darkMode ? "#fff" : "#2d3748", 
            marginLeft: 0 
          }}>
            {t.signUp}
          </span>
          
         
          <button
            onClick={handleLanguageChange}
            style={{
              padding: "4px 8px",
              backgroundColor: darkMode ? "#4a5568" : "#e2e8f0",
              color: darkMode ? "#fff" : "#2d3748",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
              border: "none"
            }}
          >
            {language === 'ar' ? 'English (EN)' : 'العربية (AR)'}
          </button>
        </div>

        <button
          onClick={handleDarkModeToggle}
          style={{
            padding: "6px 12px",
            backgroundColor: darkMode ? "#4a5568" : "#e2e8f0",
            color: darkMode ? "#fff" : "#2d3748",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
            border: "none"
          }}
        >
          {darkMode ? t.lightMode : t.darkMode}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row items-center justify-center flex-1">
        <div className="hidden lg:flex w-1/2 justify-center items-center">
          <img
            src="../../public/register.svg"
            alt="signup"
            className="max-w-[80%] h-auto"
          />
        </div>

        <div className="w-full lg:w-1/2 flex justify-center">
          <div className={cardClasses} style={{ margin: "16px" }}>
            <h2 className={`text-2xl font-bold mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
              {t.signUp}
            </h2>
            <p className={`mb-4 ${isArabic ? 'text-right' : 'text-left'} ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t.chooseRoleAndFill}
            </p>

            <div className="space-y-4">
              <div className={`flex gap-6 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
                <label className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="driver"
                    checked={role === "driver"}
                    onChange={handleRoleChange}
                    disabled={isLoading}
                  />
                  {t.driver}
                </label>
                <label className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="garage_owner"
                    checked={role === "garage_owner"}
                    onChange={handleRoleChange}
                    disabled={isLoading}
                  />
                  {t.garageOwner}
                </label>
              </div>

              <InputField
                name="username"
                placeholder={t.username}
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                isArabic={isArabic}
              />
              <InputField
                name="email"
                type="email"
                placeholder={t.email}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                isArabic={isArabic}
              />
              <InputField
                name="phone"
                placeholder={t.phone}
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                isArabic={isArabic}
              />
              <InputField
                name="national_id"
                placeholder={t.nationalId}
                value={formData.national_id}
                onChange={handleChange}
                error={errors.national_id}
                isArabic={isArabic}
              />
              <InputField
                name="password"
                type="password"
                placeholder={t.password}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                isArabic={isArabic}
              />
              <InputField
                name="confirmPassword"
                type="password"
                placeholder={t.confirmPassword}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                isArabic={isArabic}
              />

              {role === "driver" && (
                <div className="space-y-3">
                  <FileInput 
                    label={t.driverLicense} 
                    name="driver_license" 
                    onChange={handleChange} 
                    error={errors.driver_license}
                    isArabic={isArabic}
                  />
                  <FileInput 
                    label={t.carLicense} 
                    name="car_license" 
                    onChange={handleChange} 
                    error={errors.car_license}
                    isArabic={isArabic}
                  />
                  <FileInput 
                    label={t.nationalIdImage} 
                    name="national_id_img" 
                    onChange={handleChange} 
                    error={errors.national_id_img}
                    isArabic={isArabic}
                  />
                </div>
              )}

              <button 
                type="submit"
                onClick={handleSubmit}
                className={`w-full py-2 rounded transition-colors ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
                disabled={isLoading}
              >
                {isLoading ? t.registering : t.register}
              </button>

              
              <p className={`text-center text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t.alreadyHaveAccount}{" "}
                <a 
                  href="/login" 
                  className="text-red-600 underline hover:text-red-700"
                >
                  {t.login}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
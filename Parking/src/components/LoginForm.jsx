import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/loginStyles";

const LoginForm = ({ onLoginSuccess }) => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loginData, setLoginData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
  
    const savedDarkMode = localStorage.getItem('preferredDarkMode');
    return savedDarkMode === 'true';
  });
 

  const [language, setLanguage] = useState(() => {
    
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return savedLanguage || 'en';
  });
  const translations = {
    ar: {
      login: 'تسجيل الدخول',
      lightMode: '☀ الوضع النهاري',
      darkMode: '🌙 الوضع الليلي',
      loginToApp: 'تسجيل الدخول إلى التطبيق',
      enterEmailPassword: 'أدخل بريدك الإلكتروني وكلمة المرور',
      email: 'البريد الإلكتروني',
      enterEmail: 'أدخل بريدك الإلكتروني',
      password: 'كلمة المرور',
      enterPassword: 'أدخل كلمة المرور',
      rememberMe: 'تذكرني على هذا الجهاز',
      forgotPassword: 'هل نسيت كلمة المرور؟',
      forgotPasswordAlert: 'سيتم إضافة وظيفة استرداد كلمة المرور قريباً',
      fillAllFields: 'الرجاء ملء جميع الحقول',
      invalidCredentials: 'بيانات تسجيل الدخول غير صحيحة أو الحساب غير نشط',
      loginFailed: 'فشل في تسجيل الدخول',
      invalidResponse: 'استجابة غير صحيحة من الخادم',
      loggingIn: 'جاري تسجيل الدخول...',
      loginBtn: 'تسجيل الدخول',
      dontHaveAccount: 'ليس لديك حساب؟',
      signUp: 'إنشاء حساب',
      loginSuccessful: 'تم تسجيل الدخول بنجاح!',
      welcomeBack: 'أهلاً بعودتك! تم تسجيل دخولك بنجاح.',
      role: 'الدور',
      yes: 'نعم',
      no: 'لا',
      ok: 'موافق'
    },
    en: {
      login: 'Login',
      lightMode: '☀ Light Mode',
      darkMode: '🌙 Dark Mode',
      loginToApp: 'Login to our app',
      enterEmailPassword: 'Enter your email and password',
      email: 'E-mail',
      enterEmail: 'Enter your email',
      password: 'Password',
      enterPassword: 'Enter your password',
      rememberMe: 'Remember me this device',
      forgotPassword: 'Forgot password?',
      forgotPasswordAlert: 'Forgot password functionality will be added',
      fillAllFields: 'Please fill in all fields',
      invalidCredentials: 'Invalid credentials or inactive account',
      loginFailed: 'Login failed',
      invalidResponse: 'Invalid server response',
      loggingIn: 'Logging in...',
      loginBtn: 'Login',
      dontHaveAccount: "Don't have an account?",
      signUp: 'Sign up',
      loginSuccessful: 'Login Successful!',
      welcomeBack: 'Welcome back! You have been successfully logged in.',
      role: 'Role',
      yes: 'Yes',
      no: 'No',
      ok: 'OK'
    }
  };
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

  const t = translations[language];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    localStorage.removeItem("authTokens");
    sessionStorage.removeItem("authTokens");
    setError("");
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError(t.fillAllFields);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Server error:", data);
        setError(data?.detail || t.loginFailed);
        return;
      }

      const { access, refresh, user } = data;
      const { role, is_superuser, is_staff } = user;

      if (!access || !refresh) {
        setError(t.invalidResponse);
        return;
      }

      const tokenData = { access, refresh, role, is_superuser, is_staff };
      setLoginData(tokenData);
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem("authTokens", JSON.stringify(tokenData));

      setShowSuccessMessage(true);
    } catch (err) {
      console.error("Error during login:", err);
      setError(t.invalidCredentials);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocus = (fieldName) => setFocusedField(fieldName);
  const handleBlur = (fieldName, value) => {
    if (!value) setFocusedField("");
  };

  const handleSuccessOk = () => {
    setShowSuccessMessage(false);
    if (loginData?.role === "driver") {
      navigate("/dashboard/driver");
    } else if (loginData?.role === "garage_owner") {
      navigate("/dashboard/owner");
    } else {
      navigate("/home");
    }
  };

  
  const containerStyle = {
    ...styles.container,
    backgroundColor: darkMode ? "#1a202c" : "#f7fafc",
    direction: language === 'ar' ? 'rtl' : 'ltr',
    fontFamily: language === 'ar' ? '"Cairo", "Tajawal", sans-serif' : 'inherit'
  };

  return (
    <div className={darkMode ? "dark" : ""} style={containerStyle}>
      {showSuccessMessage && (
        <div style={styles.successOverlay}>
          <div style={{
            ...styles.successModal,
            direction: language === 'ar' ? 'rtl' : 'ltr',
            textAlign: language === 'ar' ? 'right' : 'left'
          }}>
            <div style={styles.successIcon}>✓</div>
            <h3 style={styles.successTitle}>{t.loginSuccessful}</h3>
            <p style={styles.successMessage}>
              {t.welcomeBack}
            </p>
            <div style={styles.successDetails}>
              <p><strong>{t.email}:</strong> {formData.email}</p>
              <p><strong>{t.role}:</strong> {loginData?.role}</p>
              <p><strong>{t.rememberMe}:</strong> {formData.rememberMe ? t.yes : t.no}</p>
            </div>
            <button style={styles.successButton} onClick={handleSuccessOk}>
              {t.ok}
            </button>
          </div>
        </div>
      )}
      
      <header style={{
        ...styles.header,
        backgroundColor: darkMode ? "#2d3748" : "#edf2f7",
        color: darkMode ? "#fff" : "#2d3748",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingInline: "20px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ ...styles.headerText, color: darkMode ? "#fff" : "#2d3748", marginLeft: 0 }}>
            {t.login}
          </span>
          
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
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
          onClick={() => setDarkMode(!darkMode)}
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

      <main style={styles.main}>
        <div style={{
          ...styles.loginCard,
          backgroundColor: darkMode ? "#2d3748" : "#fff",
          color: darkMode ? "#e2e8f0" : "#2d3748",
          textAlign: language === 'ar' ? 'right' : 'left'
        }}>
          <div style={styles.titleSection}>
            <h2 style={styles.formTitle}>{t.loginToApp}</h2>
            <p style={styles.formSubtitle}>{t.enterEmailPassword}</p>
          </div>

          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={{
                ...styles.label,
                color: focusedField === "email"
                  ? "#667eea"
                  : darkMode ? "#e2e8f0" : "#4a5568"
              }}>
                {t.email}
              </label>
              <input
                type="email"
                name="email"
                placeholder={t.enterEmail}
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={(e) => handleBlur("email", e.target.value)}
                required
                style={{
                  ...styles.input,
                  borderColor: focusedField === "email"
                    ? "#667eea"
                    : darkMode ? "#4a5568" : "#e2e8f0",
                  backgroundColor: darkMode ? "#4a5568" : "#f7fafc",
                  color: darkMode ? "#fff" : "#000",
                  textAlign: language === 'ar' ? 'right' : 'left'
                }}
                disabled={isLoading}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={{
                ...styles.label,
                color: focusedField === "password"
                  ? "#667eea"
                  : darkMode ? "#e2e8f0" : "#4a5568"
              }}>
                {t.password}
              </label>
              <input
                type="password"
                name="password"
                placeholder={t.enterPassword}
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus("password")}
                onBlur={(e) => handleBlur("password", e.target.value)}
                required
                style={{
                  ...styles.input,
                  borderColor: focusedField === "password"
                    ? "#667eea"
                    : darkMode ? "#4a5568" : "#e2e8f0",
                  backgroundColor: darkMode ? "#4a5568" : "#f7fafc",
                  color: darkMode ? "#fff" : "#000",
                  textAlign: language === 'ar' ? 'right' : 'left'
                }}
                disabled={isLoading}
              />
            </div>

            <div style={{
              ...styles.optionsRow,
              flexDirection: language === 'ar' ? 'row-reverse' : 'row'
            }}>
              <div style={{
                ...styles.rememberMe,
                flexDirection: language === 'ar' ? 'row-reverse' : 'row'
              }}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={{
                    ...styles.checkbox,
                    marginLeft: language === 'ar' ? '8px' : '0',
                    marginRight: language === 'ar' ? '0' : '8px'
                  }}
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" style={{
                  ...styles.checkboxLabel,
                  color: darkMode ? "#e2e8f0" : "#2d3748"
                }}>
                  {t.rememberMe}
                </label>
              </div>


              <button
                style={styles.forgotLink}
                onClick={() => navigate("/password-reset")}
              >
                Forgot password?
              </button>

            </div>
            {error && <div style={{
              ...styles.error,
              textAlign: language === 'ar' ? 'right' : 'left'
            }}>{error}</div>}

            <button
              onClick={handleSubmit}
              style={{
                ...styles.loginButton,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
                backgroundColor: darkMode ? "#667eea" : "#4a90e2"
              }}
              disabled={isLoading}
            >
              {isLoading ? t.loggingIn : t.loginBtn}
            </button>

            <p style={{ 
              textAlign: 'center', 
              fontSize: '14px',
              color: darkMode ? "#cbd5e0" : "#4a5568" 
            }}>
              {t.dontHaveAccount}{" "}
              <a href="/register" style={{ color: "#e53e3e", textDecoration: "underline" }}>
                {t.signUp}
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginForm;

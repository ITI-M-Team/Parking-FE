import React, { useState, useEffect } from "react";
import  "../assets/css/loginStyle.css";

const LoginForm = ({ onLoginSuccess, darkMode, setDarkMode }) => {
  const navigate = (path) => {
    if (onLoginSuccess) {
      onLoginSuccess(path);
    } else {
      window.location.href = path;
    }
  };

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

  // Sync with global theme and persist theme changes
  useEffect(() => {
    // Update document class for CSS variables
    document.documentElement.classList.toggle("dark", darkMode);
    // Persist theme preference
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Handle theme toggle with smooth transition
  const handleThemeToggle = () => {
    // Add transition class for smooth theme switching
    document.documentElement.style.transition = 'all 0.3s ease';
    setDarkMode(!darkMode);
    
    // Remove transition after animation completes
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 300);
  };

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
      setError("Please fill in all fields");
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
        setError(data?.detail || "Login failed");
        return;
      }

      const { access, refresh, user } = data;
      const { role, is_superuser, is_staff, verification_status } = user;

      if (!access || !refresh) {
        setError("Invalid server response");
        return;
      }

      const tokenData = { access, refresh, role, is_superuser, is_staff, verification_status };
      setLoginData(tokenData);
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem("authTokens", JSON.stringify(tokenData));

      setShowSuccessMessage(true);
    } catch (err) {
      console.error("Error during login:", err);
      setError("Invalid credentials or inactive account");
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
    navigate("/home");
  };

  return (
    <div className={`login-container ${darkMode ? "dark" : ""}`}>
      {/* Success Modal */}
      {showSuccessMessage && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-icon">✓</div>
            <h3 className="success-title">Login Successful!</h3>
            <p className="success-message">
              Welcome back! You have been successfully logged in.
            </p>
            <div className="success-details">
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Role:</strong> {loginData?.is_superuser ? "Administrator" : loginData?.role}</p>
              
              {/* Only show verification status for non-superusers */}
              {!loginData?.is_superuser && (
                <p><strong>Verification Status:</strong> 
                  <span style={{
                    color: loginData?.verification_status === "Verified" ? "#10B981" : 
                          loginData?.verification_status === "Pending" ? "#F59E0B" : "#EF4444",
                    fontWeight: "bold",
                    marginLeft: "5px"
                  }}>
                    {loginData?.verification_status}
                  </span>
                </p>
              )}
              
              <p><strong>Remember me:</strong> {formData.rememberMe ? "Yes" : "No"}</p>
              
              <p style={{ color: "#10B981", fontSize: "14px", marginTop: "10px" }}>
                🏠 You'll be redirected to the home page.
              </p>
            </div>
            <button className="success-button" onClick={handleSuccessOk}>
              Continue to Home
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="login-header">
        <h1 className="header-title">Login</h1>
        <button
          className="theme-toggle"
          onClick={handleThemeToggle}
        >
          <span>{darkMode ? "☀️" : "🌙"}</span>
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="login-main">
        <div className="login-card">
          <div className="title-section">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Sign in to your account to continue</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label 
                className={`input-label ${focusedField === "email" ? "focused" : ""}`}
                style={{
                  color: focusedField === "email" ? "#667eea" : undefined
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={(e) => handleBlur("email", e.target.value)}
                required
                className="input-field"
                style={{
                  borderColor: focusedField === "email" ? "#667eea" : undefined
                }}
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label 
                className={`input-label ${focusedField === "password" ? "focused" : ""}`}
                style={{
                  color: focusedField === "password" ? "#667eea" : undefined
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus("password")}
                onBlur={(e) => handleBlur("password", e.target.value)}
                required
                className="input-field"
                style={{
                  borderColor: focusedField === "password" ? "#667eea" : undefined
                }}
                disabled={isLoading}
              />
            </div>

            <div className="options-row">
              <div className="remember-me">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="checkbox-input"
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="checkbox-label">
                  Remember me on this device
                </label>
              </div>
              <a href="/password-reset" className="forgot-link">
                Forgot password?
              </a>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className={`login-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span>Signing In</span>
                  <div style={{ marginLeft: '12px', display: 'flex', gap: '2px' }}>
                    <span 
                      style={{ 
                        width: '4px', 
                        height: '4px', 
                        backgroundColor: 'currentColor', 
                        borderRadius: '50%',
                        animation: 'bounce 1.4s ease-in-out infinite',
                        animationDelay: '0s'
                      }}
                    ></span>
                    <span 
                      style={{ 
                        width: '4px', 
                        height: '4px', 
                        backgroundColor: 'currentColor', 
                        borderRadius: '50%',
                        animation: 'bounce 1.4s ease-in-out infinite',
                        animationDelay: '0.2s'
                      }}
                    ></span>
                    <span 
                      style={{ 
                        width: '4px', 
                        height: '4px', 
                        backgroundColor: 'currentColor', 
                        borderRadius: '50%',
                        animation: 'bounce 1.4s ease-in-out infinite',
                        animationDelay: '0.4s'
                      }}
                    ></span>
                  </div>
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="signup-text">
              Don't have an account?{" "}
              <a href="/register" className="signup-link">
                Create one here
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginForm;
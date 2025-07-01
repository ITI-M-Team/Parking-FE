import React, { useState } from "react";
import styles from "../assets/loginStyles";

const LoginForm = ({ onLoginSuccess }) => {
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
  const [darkMode, setDarkMode] = useState(false);

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
      const { role } = user;

      if (!access || !refresh || !role) {
        setError("Invalid server response");
        return;
      }

      const tokenData = { access, refresh, role };
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
    if (loginData?.role === "driver") {
      navigate("/dashboard/driver");
    } else if (loginData?.role === "garage_owner") {
      navigate("/dashboard/garage");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div
      className={darkMode ? "dark" : ""}
      style={{
        ...styles.container,
        backgroundColor: darkMode ? "#1a202c" : "#f7fafc",
      }}
    >
      {showSuccessMessage && (
        <div style={styles.successOverlay}>
          <div style={styles.successModal}>
            <div style={styles.successIcon}>✓</div>
            <h3 style={styles.successTitle}>Login Successful!</h3>
            <p style={styles.successMessage}>
              Welcome back! You have been successfully logged in.
            </p>
            <div style={styles.successDetails}>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Role:</strong> {loginData?.role}
              </p>
              <p>
                <strong>Remember me:</strong>{" "}
                {formData.rememberMe ? "Yes" : "No"}
              </p>
            </div>
            <button style={styles.successButton} onClick={handleSuccessOk}>
              OK
            </button>
          </div>
        </div>
      )}

      <header
        style={{
          ...styles.header,
          backgroundColor: darkMode ? "#2d3748" : "#edf2f7",
          color: darkMode ? "#fff" : "#2d3748",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingInline: "20px",
        }}
      >
        <span
          style={{
            ...styles.headerText,
            color: darkMode ? "#fff" : "#2d3748",
            marginLeft: 0,
          }}
        >
          Login
        </span>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "6px 12px",
            backgroundColor: darkMode ? "#4a5568" : "#e2e8f0",
            color: darkMode ? "#fff" : "#2d3748",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
            border: "none",
          }}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <main style={styles.main}>
        <div
          style={{
            ...styles.loginCard,
            backgroundColor: darkMode ? "#2d3748" : "#fff",
            color: darkMode ? "#e2e8f0" : "#2d3748",
          }}
        >
          <div style={styles.titleSection}>
            <h2 style={styles.formTitle}>Login to our app</h2>
            <p style={styles.formSubtitle}>Enter your email and password</p>
          </div>

          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <label
                style={{
                  ...styles.label,
                  color:
                    focusedField === "email"
                      ? "#667eea"
                      : darkMode
                      ? "#e2e8f0"
                      : "#4a5568",
                }}
              >
                E-mail
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={(e) => handleBlur("email", e.target.value)}
                required
                style={{
                  ...styles.input,
                  borderColor:
                    focusedField === "email"
                      ? "#667eea"
                      : darkMode
                      ? "#4a5568"
                      : "#e2e8f0",
                  backgroundColor: darkMode ? "#4a5568" : "#f7fafc",
                  color: darkMode ? "#fff" : "#000",
                }}
                disabled={isLoading}
              />
            </div>

            <div style={styles.inputGroup}>
              <label
                style={{
                  ...styles.label,
                  color:
                    focusedField === "password"
                      ? "#667eea"
                      : darkMode
                      ? "#e2e8f0"
                      : "#4a5568",
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
                style={{
                  ...styles.input,
                  borderColor:
                    focusedField === "password"
                      ? "#667eea"
                      : darkMode
                      ? "#4a5568"
                      : "#e2e8f0",
                  backgroundColor: darkMode ? "#4a5568" : "#f7fafc",
                  color: darkMode ? "#fff" : "#000",
                }}
                disabled={isLoading}
              />
            </div>

            <div style={styles.checkboxContainer}>
              <div style={styles.rememberMe}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={styles.checkbox}
                  disabled={isLoading}
                />
                <label
                  htmlFor="rememberMe"
                  style={{
                    ...styles.checkboxLabel,
                    color: darkMode ? "#e2e8f0" : "#2d3748",
                  }}
                >
                  Remember me this device
                </label>
              </div>


              <a href="/password-reset" style={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button
              onClick={handleSubmit}
              style={{
                ...styles.loginButton,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
                backgroundColor: darkMode ? "#667eea" : "#4a90e2",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p
              className="text-center text-sm"
              style={{ color: darkMode ? "#cbd5e0" : "#4a5568" }}
            >
              Don't have an account?{" "}
              <a href="/register" className="text-red-500 underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginForm;

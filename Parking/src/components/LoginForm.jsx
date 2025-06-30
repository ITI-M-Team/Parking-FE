
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
  const [darkMode, setDarkMode] = useState(false); // ✅ الوضع الليلي

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
    <div className={darkMode ? "dark" : ""} style={{ ...styles.container, backgroundColor: darkMode ? "#1a202c" : "#f7fafc" }}>
      {showSuccessMessage && (
        <div style={styles.successOverlay}>
          <div style={styles.successModal}>
            <div style={styles.successIcon}>✓</div>
            <h3 style={styles.successTitle}>Login Successful!</h3>
            <p style={styles.successMessage}>
              Welcome back! You have been successfully logged in.
            </p>
            <div style={styles.successDetails}>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Role:</strong> {loginData?.role}</p>
              <p><strong>Remember me:</strong> {formData.rememberMe ? "Yes" : "No"}</p>

      <div style={styles.content}>
        {/* Left Side - Illustration */}
        <div style={styles.leftSide}>
          {/* Character with Phone */}
          <div style={styles.characterContainer}>
            <div style={styles.character}>
              <div style={styles.characterHead}></div>
              <div style={styles.characterBody}></div>
              <div style={styles.characterArm1}></div>
              <div style={styles.characterArm2}></div>
              <div style={styles.characterLeg1}></div>
              <div style={styles.characterLeg2}></div>
              <div style={styles.characterPhone}></div>
            </div>
          </div>

          {/* Mobile Frame */}
          <div style={styles.mobileFrame}>
            <div style={styles.mobileNotch}></div>
            <div style={styles.mobileHeader}>
              <div style={styles.backArrow}>←</div>
              <div style={styles.registerLink}>Register</div>
            </div>

            <div style={styles.mobileContent}>
              <h3 style={styles.mobileTitle}>Sign In</h3>
              <p style={styles.mobileSubtitle}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              <div style={styles.mobileInputs}>
                <div style={styles.mobileInput}>
                  <span style={styles.inputPlaceholder}>Username</span>
                </div>
                <div style={styles.mobileInput}>
                  <span style={styles.inputPlaceholder}>Password</span>
                </div>
              </div>

              <div style={styles.forgotPasswordMobile}>Forgot password?</div>

              <button style={styles.mobileSignInButton}>Sign In</button>

              <div style={styles.orDivider}>
                <div style={styles.orLine}></div>
                <span style={styles.orText}>Or</span>
                <div style={styles.orLine}></div>
              </div>

              <button style={styles.mobileGoogleButton}>
                Sign In With Google →
              </button>
            </div>
            <button style={styles.successButton} onClick={handleSuccessOk}>
              OK
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
  <span style={{ ...styles.headerText, color: darkMode ? "#fff" : "#2d3748", marginLeft: 0 }}>Login</span>

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
    {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
  </button>
</header>

      <main style={styles.main}>
        <div style={{
          ...styles.loginCard,
          backgroundColor: darkMode ? "#2d3748" : "#fff",
          color: darkMode ? "#e2e8f0" : "#2d3748"
        }}>
          <div style={styles.titleSection}>
            <h2 style={styles.formTitle}>Login to our app</h2>
            <p style={styles.formSubtitle}>Enter your email and password</p>
          </div>

          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={{
                ...styles.label,
                color: focusedField === "email"
                  ? "#667eea"
                  : darkMode ? "#e2e8f0" : "#4a5568"
              }}>
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
                  borderColor: focusedField === "email"
                    ? "#667eea"
                    : darkMode ? "#4a5568" : "#e2e8f0",
                  backgroundColor: darkMode ? "#4a5568" : "#f7fafc",
                  color: darkMode ? "#fff" : "#000"
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
                  borderColor: focusedField === "password"
                    ? "#667eea"
                    : darkMode ? "#4a5568" : "#e2e8f0",
                  backgroundColor: darkMode ? "#4a5568" : "#f7fafc",
                  color: darkMode ? "#fff" : "#000"
                }}
                disabled={isLoading}
              />
            </div>

            <div style={styles.optionsRow}>
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
                <label htmlFor="rememberMe" style={{
                  ...styles.checkboxLabel,
                  color: darkMode ? "#e2e8f0" : "#2d3748"
                }}>
                  Remember me this device
                </label>

              </div>
              <button
                style={styles.forgotLink}
                onClick={() => alert("Forgot password functionality will be added")}
                <a href="/password-reset" style={styles.forgotLink}>Forgot password?</a>
              </div>

              {error && <p style={styles.error}>{error}</p>}

              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  ...styles.loginButton,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {error && <div style={styles.error}>{error}</div>}

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
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm" style={{ color: darkMode ? "#cbd5e0" : "#4a5568" }}>
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


const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#2c2c2c",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    backgroundColor: "#3c3c3c",
    padding: "15px 30px",
    borderBottom: "1px solid #555",
  },
  headerText: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "500",
  },
  content: {
    display: "flex",
    height: "calc(100vh - 60px)",
    backgroundColor: "#f5f5f5",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  leftSide: {
    flex: 1,
    maxWidth: "600px",
    minWidth: "400px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8e8e8",
    position: "relative",
    padding: "40px 20px",
  },
  characterContainer: {
    position: "absolute",
    left: "10%",
    bottom: "30%",
    zIndex: 1,
  },
  character: {
    position: "relative",
  },
  characterHead: {
    width: "35px",
    height: "35px",
    backgroundColor: "#bbb",
    borderRadius: "50%",
    marginBottom: "5px",
    marginLeft: "22px",
    border: "2px solid #888",
  },
  characterBody: {
    width: "80px",
    height: "90px",
    backgroundColor: "#999",
    borderRadius: "40px 40px 15px 15px",
    position: "relative",
  },
  characterArm1: {
    width: "25px",
    height: "10px",
    backgroundColor: "#999",
    borderRadius: "5px",
    position: "absolute",
    top: "20px",
    left: "-15px",
    transform: "rotate(-25deg)",
  },
  characterArm2: {
    width: "30px",
    height: "10px",
    backgroundColor: "#999",
    borderRadius: "5px",
    position: "absolute",
    top: "25px",
    right: "-18px",
    transform: "rotate(35deg)",
  },
  characterLeg1: {
    width: "16px",
    height: "45px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    position: "absolute",
    bottom: "-45px",
    left: "18px",
  },
  characterLeg2: {
    width: "16px",
    height: "45px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    position: "absolute",
    bottom: "-45px",
    right: "18px",
  },
  characterPhone: {
    width: "12px",
    height: "20px",
    backgroundColor: "#333",
    borderRadius: "2px",
    position: "absolute",
    top: "15px",
    right: "-22px",
  },
  mobileFrame: {
    width: "250px",
    height: "480px",
    backgroundColor: "#fff",
    borderRadius: "30px",
    border: "5px solid #333",
    padding: "15px",
    position: "relative",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
    zIndex: 2,
  },
  mobileNotch: {
    width: "50px",
    height: "5px",
    backgroundColor: "#333",
    borderRadius: "3px",
    position: "absolute",
    top: "6px",
    left: "50%",
    transform: "translateX(-50%)",
  },
  mobileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    marginTop: "12px",
    fontSize: "14px",
  },
  backArrow: {
    fontSize: "16px",
    color: "#333",
    cursor: "pointer",
  },
  registerLink: {
    fontSize: "13px",
    color: "#007bff",
    cursor: "pointer",
  },
  mobileContent: {
    padding: "0 8px",
  },
  mobileTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "6px",
    margin: "0 0 6px 0",
  },
  mobileSubtitle: {
    fontSize: "11px",
    color: "#666",
    lineHeight: "1.3",
    marginBottom: "25px",
    margin: "0 0 25px 0",
  },
  mobileInputs: {
    marginBottom: "12px",
  },
  mobileInput: {
    height: "40px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    marginBottom: "12px",
    border: "1px solid #e9ecef",
    display: "flex",
    alignItems: "center",
    paddingLeft: "12px",
  },
  inputPlaceholder: {
    color: "#adb5bd",
    fontSize: "12px",
  },
  forgotPasswordMobile: {
    textAlign: "right",
    fontSize: "11px",
    color: "#333",
    marginBottom: "20px",
    cursor: "pointer",
  },
  mobileSignInButton: {
    width: "100%",
    height: "40px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    marginBottom: "15px",
  },
  orDivider: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    gap: "10px",
  },
  orLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#ddd",
  },
  orText: {
    color: "#666",
    fontSize: "12px",
    padding: "0 5px",
  },
  mobileGoogleButton: {
    width: "100%",
    height: "40px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    fontSize: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  parkingText: {
    position: "absolute",
    bottom: "20px",
    left: "40px",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
  },
  rightSide: {
    flex: 1,
    maxWidth: "600px",
    minWidth: "400px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "40px 20px",
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
  },
  formTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "8px",
    textAlign: "left",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "30px",
    textAlign: "left",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    color: "#333",
    marginBottom: "8px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#fff",
    outline: "none",
    transition: "border-color 0.3s",
    boxSizing: "border-box",
  },
  checkboxContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "10px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#666",
    cursor: "pointer",
  },
  checkbox: {
    marginRight: "8px",
    width: "16px",
    height: "16px",
  },
  forgotLink: {
    fontSize: "14px",
    color: "#ff3333",
    textDecoration: "none",
  },
  loginButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#ff3333",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  error: {
    color: "#ff3333",
    fontSize: "14px",
    marginBottom: "15px",
    textAlign: "center",
  },
};

export default LoginForm;

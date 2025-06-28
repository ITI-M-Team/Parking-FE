import React, { useState } from "react";

const LoginForm = ({ onLoginSuccess }) => {
  // استخدام window.location للتوجيه أو callback
  const navigate = (path) => {
    if (onLoginSuccess) {
      onLoginSuccess(path);
    } else {
      window.location.href = path;
    }
  };

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.identifier || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // محاكاة API call (في البيئة الحقيقية، استخدمي axios)
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.identifier,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const { access, role } = data;

      // حفظ التوكن
      if (formData.rememberMe) {
        localStorage.setItem("token", access);
      } else {
        sessionStorage.setItem("token", access);
      }

      // التوجيه حسب الدور
      if (role === "driver") {
        navigate("/dashboard/driver");
      } else if (role === "garage_owner") {
        navigate("/dashboard/garage");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or inactive account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerText}>Login</span>
      </div>

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
          </div>

          <div style={styles.parkingText}>Parking</div>
        </div>

        {/* Right Side - Login Form */}
        <div style={styles.rightSide}>
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>Login to our app</h2>
            <p style={styles.formSubtitle}>Enter username and password</p>

            <div onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>E-mail</label>
                <input
                  type="text"
                  name="identifier"
                  placeholder="Enter your email"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  disabled={isLoading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  disabled={isLoading}
                />
              </div>

              <div style={styles.checkboxContainer}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    style={styles.checkbox}
                    disabled={isLoading}
                  />
                  Remember me this device
                </label>
                <a href="#" style={styles.forgotLink}>Forgot password?</a>
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
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
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

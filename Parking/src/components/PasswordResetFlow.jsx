import React, { useState } from "react";

const PasswordResetFlow = () => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const BASE_URL = "http://localhost:8000/api";

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  const handleRequestReset = async () => {
    resetMessages();
    try {
      const payload = {
        method,
        ...(method === "email" ? { email } : { phone }),
      };

      const res = await fetch(`${BASE_URL}/password-reset/request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to send OTP");

      setStep(2);
      setMessage("OTP sent successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOTP = async () => {
    resetMessages();
    try {
      const payload = {
        method,
        otp,
        ...(method === "email" ? { email } : { phone }),
      };

      const res = await fetch(`${BASE_URL}/password-reset/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid OTP");

      setStep(3);
      setMessage("OTP verified. You may reset your password.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmReset = async () => {
    resetMessages();
    try {
      const payload = {
        method,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
        ...(method === "email" ? { email } : { phone }),
      };

      const res = await fetch(`${BASE_URL}/password-reset/confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Password reset failed");

      setStep(4);
      setMessage("Password reset successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Your Password</h2>

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}

        {step === 1 && (
          <>
            <div style={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="method"
                  value="email"
                  checked={method === "email"}
                  onChange={() => setMethod("email")}
                />
                Email
              </label>
              <label>
                <input
                  type="radio"
                  name="method"
                  value="phone"
                  checked={method === "phone"}
                  onChange={() => setMethod("phone")}
                />
                Phone
              </label>
            </div>

            {method === "email" ? (
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            ) : (
              <input
                type="text"
                placeholder="Enter your phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.input}
              />
            )}

            <button style={styles.button} onClick={handleRequestReset}>
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              style={styles.input}
            />
            <button style={styles.button} onClick={handleVerifyOTP}>
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
            <button style={styles.button} onClick={handleConfirmReset}>
              Reset Password
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <p>Password has been reset successfully.</p>
            <a href="/login" style={styles.link}>Go to Login</a>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f3f5f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    marginBottom: "1.5rem",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    marginBottom: "1rem",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    backgroundColor: "#fdfdfd",
  },
  button: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#ff3333",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },
  link: {
    marginTop: "1.2rem",
    fontSize: "15px",
    color: "#007bff",
    textDecoration: "none",
  },
  radioGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
    marginBottom: "1rem",
    fontSize: "15px",
    color: "#444",
  },
  error: {
    color: "#ff3333",
    fontSize: "14px",
    marginBottom: "1rem",
    textAlign: "center",
  },
  success: {
    color: "#28a745",
    fontSize: "14px",
    marginBottom: "1rem",
    textAlign: "center",
  },
};

export default PasswordResetFlow;

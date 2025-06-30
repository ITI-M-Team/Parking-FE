import React from "react";
import axios from "../../apis/config";

const Step3_ConfirmPassword = ({
  method,
  email,
  phone,
  otp,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  setStep,
  setMessage,
  setError,
  resetMessages,
}) => {
  const handleConfirmReset = async () => {
    resetMessages();

    const payload = {
      method,
      otp,
      new_password: newPassword,
      confirm_password: confirmPassword,
      ...(method === "email" ? { email } : { phone }),
    };

    console.log("🔐 Password Reset Payload:", payload); // Debug: Check what’s being sent

    try {
      const res = await axios.post("/password-reset/confirm/", payload);

      if (res.status === 200) {
        setStep(4);
        setMessage("✅ Password has been reset successfully.");
      } else {
        setError("❌ Unexpected response from server.");
      }
    } catch (err) {
      console.error("🚨 Error during password reset:", err.response?.data || err.message);
      const detail = err.response?.data?.detail;
      const fullError =
        detail ||
        (typeof err.response?.data === "object"
          ? Object.values(err.response.data).join(" ")
          : err.message);
      setError(fullError);
    }
  };

  return (
    <div>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="input"
      />
      <button className="button" onClick={handleConfirmReset}>
        Reset Password
      </button>
    </div>
  );
};

export default Step3_ConfirmPassword;

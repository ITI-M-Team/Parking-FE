import React from "react";
import axios from "../../api/axios";

const Step3_ConfirmPassword = ({ method, email, phone, otp, newPassword, setNewPassword, confirmPassword, setConfirmPassword, setStep, setMessage, setError, resetMessages }) => {
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

      const res = await axios.post("/password-reset/confirm/", payload);

      if (res.status !== 200) throw new Error(res.data.detail || "Password reset failed");

      setStep(4);
      setMessage("Password reset successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" />
      <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" />
      <button className="button" onClick={handleConfirmReset}>
        Reset Password
      </button>
    </div>
  );
};

export default Step3_ConfirmPassword;

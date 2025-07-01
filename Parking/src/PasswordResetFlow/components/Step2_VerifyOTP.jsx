import React from "react";
import axios from "../../apis/config";

const Step2_VerifyOTP = ({ method, email, phone, otp, setOTP, setStep, setMessage, setError, resetMessages }) => {
  const handleVerifyOTP = async () => {
    resetMessages();
    try {
      const payload = {
        method,
        otp,
        ...(method === "email" ? { email } : { phone }),
      };

      const res = await axios.post("/password-reset/verify/", payload);

      if (res.status !== 200) throw new Error(res.data.detail || "Invalid OTP");

      setStep(3);
      setMessage("OTP verified. You may reset your password.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOTP(e.target.value)} className="input" />
      <button className="button" onClick={handleVerifyOTP}>
        Verify OTP
      </button>
    </div>
  );
};

export default Step2_VerifyOTP;
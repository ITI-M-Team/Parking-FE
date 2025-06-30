import React from "react";
import axios from "../../api/axios";

const Step1_RequestOTP = ({ method, setMethod, email, setEmail, phone, setPhone, setStep, setMessage, setError, resetMessages }) => {
  const handleRequestReset = async () => {
    resetMessages();
    try {
      const payload = {
        method,
        ...(method === "email" ? { email } : { phone }),
      };

      const res = await axios.post("/password-reset/request/", payload);

      if (res.status !== 200) throw new Error(res.data.detail || "Failed to send OTP");

      setStep(2);
      setMessage("OTP sent successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="radio-group">
        <label>
          <input type="radio" name="method" value="email" checked={method === "email"} onChange={() => setMethod("email")} />
          Email
        </label>
        <label>
          <input type="radio" name="method" value="phone" checked={method === "phone"} onChange={() => setMethod("phone")} />
          Phone
        </label>
      </div>

      {method === "email" ? (
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
      ) : (
        <input type="text" placeholder="Enter your phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
      )}

      <button className="button" onClick={handleRequestReset}>
        Send OTP
      </button>
    </div>
  );
};

export default Step1_RequestOTP;
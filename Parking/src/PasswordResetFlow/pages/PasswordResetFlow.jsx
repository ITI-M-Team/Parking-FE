import React, { useState } from "react";
import Step1_RequestOTP from "../components/Step1_RequestOTP";
import Step2_VerifyOTP from "../components/Step2_VerifyOTP";
import Step3_ConfirmPassword from "../components/Step3_ConfirmPassword";
import Step4_Success from "../components/Step4_Success";
import "../styles/PasswordResetFlow.css";

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

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  return (
    <div className="page">
      <div className="card">
        <h2 className="title">Reset Your Password</h2>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        {step === 1 && (
          <Step1_RequestOTP {...{ method, setMethod, email, setEmail, phone, setPhone, setStep, setMessage, setError, resetMessages }} />
        )}
        {step === 2 && (
          <Step2_VerifyOTP {...{ method, email, phone, otp, setOTP, setStep, setMessage, setError, resetMessages }} />
        )}
        {step === 3 && (
          <Step3_ConfirmPassword {...{ method, email, phone, otp, newPassword, setNewPassword, confirmPassword, setConfirmPassword, setStep, setMessage, setError, resetMessages }} />
        )}
        {step === 4 && <Step4_Success />}
      </div>
    </div>
  );
};

export default PasswordResetFlow;

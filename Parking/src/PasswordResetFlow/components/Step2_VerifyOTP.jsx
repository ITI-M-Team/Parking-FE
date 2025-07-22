import React from "react";
import axios from "../../apis/config";
import { useLanguage } from '../../context/LanguageContext';

const Step2_VerifyOTP = ({ method, email, phone, otp, setOTP, setStep, setMessage, setError, resetMessages }) => {
  const { language } = useLanguage(); 

  
  const t = {
    en: {
      placeholder: "Enter OTP",
      verifyButton: "Verify OTP",
      successMessage: "OTP verified. You may reset your password.",
      invalidOtp: "Invalid OTP"
    },
    ar: {
      placeholder: "أدخل رمز التحقق",
      verifyButton: "التحقق من الرمز",
      successMessage: "تم التحقق من الرمز. يمكنك الآن إعادة تعيين كلمة المرور.",
      invalidOtp: "رمز التحقق غير صحيح"
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

      const res = await axios.post("/password-reset/verify/", payload);

      if (res.status !== 200) throw new Error(res.data.detail || t[language].invalidOtp);

      setStep(3);
      setMessage(t[language].successMessage);
    } catch (err) {
      setError(err.message); 
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder={t[language].placeholder}
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
        className="input"
      />
      <button className="button" onClick={handleVerifyOTP}>
        {t[language].verifyButton}
      </button>
    </div>
  );
};

export default Step2_VerifyOTP;


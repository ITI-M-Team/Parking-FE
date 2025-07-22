import React from "react";
import axios from "../../apis/config";
import { useLanguage } from '../../context/LanguageContext'; 

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
  const { language } = useLanguage(); 


  const t = {
    en: {
      placeholderNew: "New Password",
      placeholderConfirm: "Confirm New Password",
      resetButton: "Reset Password",
      successMessage: "✅ Password has been reset successfully.",
      errorUnexpected: "❌ Unexpected response from server."
    },
    ar: {
      placeholderNew: "كلمة المرور الجديدة",
      placeholderConfirm: "تأكيد كلمة المرور الجديدة",
      resetButton: "إعادة تعيين كلمة المرور",
      successMessage: "✅ تم إعادة تعيين كلمة المرور بنجاح.",
      errorUnexpected: "❌ استجابة غير متوقعة من الخادم."
    }
  };

  const handleConfirmReset = async () => {
    resetMessages();

    const payload = {
      method,
      otp,
      new_password: newPassword,
      confirm_password: confirmPassword,
      ...(method === "email" ? { email } : { phone }),
    };

    console.log("🔐 Password Reset Payload:", payload); 
    try {
      const res = await axios.post("/password-reset/confirm/", payload);

      if (res.status === 200) {
        setStep(4);
        setMessage(t[language].successMessage);
      } else {
        setError(t[language].errorUnexpected);
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
        placeholder={t[language].placeholderNew}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder={t[language].placeholderConfirm}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="input"
      />
      <button className="button" onClick={handleConfirmReset}>
        {t[language].resetButton}
      </button>
    </div>
  );
};

export default Step3_ConfirmPassword;
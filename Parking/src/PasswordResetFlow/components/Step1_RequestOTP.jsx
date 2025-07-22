import React from "react";
import axios from "../../apis/config";
import { useLanguage } from '../../context/LanguageContext'; 

const Step1_RequestOTP = ({ 
  method, 
  setMethod, 
  email, 
  setEmail, 
  phone, 
  setPhone, 
  setStep, 
  setMessage, 
  setError, 
  resetMessages 
}) => {
  const { language } = useLanguage(); 

 
  const t = {
    en: {
      chooseMethod: "Choose your verification method:",
      emailLabel: "Email",
      phoneLabel: "Phone",
      placeholderEmail: "Enter your email",
      placeholderPhone: "Enter your phone",
      sendOtp: "Send OTP"
    },
    ar: {
      chooseMethod: "اختر طريقة التحقق:",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "الهاتف",
      placeholderEmail: "أدخل بريدك الإلكتروني",
      placeholderPhone: "أدخل رقم هاتفك",
      sendOtp: "إرسال رمز التحقق"
    }
  };

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
      setMessage(language === 'ar' ? 'تم إرسال رمز التحقق بنجاح' : 'OTP sent successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="text-center">
     
      <p className="mb-4 font-medium">{t[language].chooseMethod}</p>
      <div className="flex justify-center gap-6 mb-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="method"
            value="email"
            checked={method === "email"}
            onChange={() => setMethod("email")}
            className="w-4 h-4 accent-blue-600"
          />
          <span>{t[language].emailLabel}</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="method"
            value="phone"
            checked={method === "phone"}
            onChange={() => setMethod("phone")}
            className="w-4 h-4 accent-blue-600"
          />
          <span>{t[language].phoneLabel}</span>
        </label>
      </div>


      {method === "email" ? (
        <input
          type="email"
          placeholder={t[language].placeholderEmail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
      ) : (
        <input
          type="text"
          placeholder={t[language].placeholderPhone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
      )}

    
      <button
        onClick={handleRequestReset}
        className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        {t[language].sendOtp}
      </button>
    </div>
  );
};

export default Step1_RequestOTP;

import React from "react";
import { useLanguage } from '../../context/LanguageContext'; 

const Step4_Success = () => {
  const { language } = useLanguage(); 

 
  const t = {
    en: {
      successMessage: "Password has been reset successfully.",
      loginLink: "Go to Login"
    },
    ar: {
      successMessage: "تم إعادة تعيين كلمة المرور بنجاح.",
      loginLink: "الذهاب إلى تسجيل الدخول"
    }
  };

  return (
    <div>
      <p>{t[language].successMessage}</p>
      <a href="/login" className="link">{t[language].loginLink}</a>
    </div>
  );
};

export default Step4_Success;
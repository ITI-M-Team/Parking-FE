import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext'; 

function Activation({ darkMode }) {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const { language } = useLanguage(); 

  
  const t = {
    en: {
      title: "Account Activation",
      success: "✅ Your account has been activated! You can now log in.",
      alreadyActivated: "ℹ️ This account is already activated.",
      invalidToken: "❌ Activation link is invalid or expired.",
      unknownStatus: "⚠️ Unknown activation status.",
      goLogin: "Go to Login"
    },
    ar: {
      title: "تفعيل الحساب",
      success: "✅ تم تفعيل حسابك! يمكنك الآن تسجيل الدخول.",
      alreadyActivated: "ℹ️ هذا الحساب مفعل بالفعل.",
      invalidToken: "❌ رابط التفعيل غير صالح أو منتهي الصلاحية.",
      unknownStatus: "⚠️ حالة تفعيل غير معروفة.",
      goLogin: "الذهاب إلى تسجيل الدخول"
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  let message;
  let messageColor;

  switch (status) {
    case "success":
      message = t[language].success;
      messageColor = "text-green-600 dark:text-green-400";
      break;
    case "already-activated":
      message = t[language].alreadyActivated;
      messageColor = "text-blue-600 dark:text-blue-400";
      break;
    case "invalid-token":
    case "invalid-link":
      message = t[language].invalidToken;
      messageColor = "text-red-600 dark:text-red-400";
      break;
    default:
      message = t[language].unknownStatus;
      messageColor = "text-yellow-600 dark:text-yellow-400";
  }

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className={`max-w-md w-full text-center p-6 rounded-lg shadow-lg transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h1 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {t[language].title}
        </h1>
        <p className={`text-lg font-medium transition-colors duration-300 ${messageColor}`}>
          {message}
        </p>

        
        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/login'}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {t[language].goLogin}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Activation;



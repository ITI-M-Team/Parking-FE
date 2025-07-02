import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
function Activation({ darkMode }) {
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");

    useEffect(() => {
        // Ensure dark mode is applied to the document
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
            message = "✅ Your account has been activated! You can now log in.";
            messageColor = "text-green-600 dark:text-green-400";
            break;
        case "already-activated":
            message = "ℹ️ This account is already activated.";
            messageColor = "text-blue-600 dark:text-blue-400";
            break;
        case "invalid-token":
        case "invalid-link":
            message = "❌ Activation link is invalid or expired.";
            messageColor = "text-red-600 dark:text-red-400";
            break;
        default:
            message = "⚠️ Unknown activation status.";
            messageColor = "text-yellow-600 dark:text-yellow-400";
    }
  return (
     <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
            darkMode 
                ? 'bg-gray-900' 
                : 'bg-gray-100'
        }`}>
            <div className={`max-w-md w-full text-center p-6 rounded-lg shadow-lg transition-colors duration-300 ${
                darkMode 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
            }`}>
                <h1 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                    darkMode 
                        ? 'text-white' 
                        : 'text-gray-900'
                }`}>
                    Account Activation
                </h1>
                <p className={`text-lg font-medium transition-colors duration-300 ${messageColor}`}>
                    {message}
                </p>
                
                {/* Optional: Add a back to login button */}
                <div className="mt-6">
                    <button 
                        onClick={() => window.location.href = '/login'}
                        className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                            darkMode
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
  )
}

export default Activation






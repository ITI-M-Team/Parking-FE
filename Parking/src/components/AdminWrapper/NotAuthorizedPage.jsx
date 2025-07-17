import React, { useState, useEffect } from 'react';
import { ShieldX, ArrowLeft, Home, Lock, AlertTriangle } from 'lucide-react';
import "../../assets/Admin/notauthorized.css"

function NotAuthorizedPage() {
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    // Get the reason from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const reason = urlParams.get('reason');
    
    // Only increment counter for actual unauthorized attempts
    // NOT for verification-related redirects
    if (reason !== 'not_verified') {
      const attempts = parseInt(localStorage.getItem('unauthorizedAttempts') || '0') + 1;
      setAttemptCount(attempts);
      localStorage.setItem('unauthorizedAttempts', attempts.toString());
      
      // Clear attempts after 24 hours
      setTimeout(() => {
        localStorage.removeItem('unauthorizedAttempts');
      }, 24 * 60 * 60 * 1000);
    } else {
      // For verification issues, just get the current count without incrementing
      const currentAttempts = parseInt(localStorage.getItem('unauthorizedAttempts') || '0');
      setAttemptCount(currentAttempts);
    }
  }, []);

  // Get the reason to customize the message
  const urlParams = new URLSearchParams(window.location.search);
  const reason = urlParams.get('reason');
  
  // Customize message based on reason
  const getErrorMessage = () => {
    switch (reason) {
      case 'not_verified':
        return {
          title: "Verification Required",
          message: (
            <>
              Your account verification is pending.
              <br />
              <span className="text-yellow-400 font-semibold">Document verification required.</span>
            </>
          )
        };
      case 'insufficient_permissions':
        return {
          title: "Insufficient Permissions",
          message: (
            <>
              You don't have the required permissions to access this resource.
              <br />
              <span className="text-red-400 font-semibold">Contact administrator for access.</span>
            </>
          )
        };
      default:
        return {
          title: "Access Denied",
          message: (
            <>
              You don't have permission to access this resource.
              <br />
              <span className="text-red-400 font-semibold">Please check your credentials.</span>
            </>
          )
        };
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements remain the same */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Security warning for multiple attempts - only show for actual unauthorized attempts */}
        {attemptCount > 3 && reason !== 'not_verified' && (
          <div className="mb-4 p-4 bg-red-600/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">Multiple unauthorized access attempts detected</span>
            </div>
          </div>
        )}

        {/* Animated shield icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30 animate-ping"></div>
          <div className="relative bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center shadow-2xl animate-bounce">
            <ShieldX className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Error code */}
        <div className="mb-6 transform animate-fade-in-up">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            403
          </h1>
        </div>

        {/* Main heading */}
        <div className="mb-4 transform animate-fade-in-up delay-200">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {errorInfo.title}
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        {/* Description */}
        <div className="mb-8 transform animate-fade-in-up delay-300">
          <p className="text-gray-300 text-lg leading-relaxed">
            {errorInfo.message}
          </p>
        </div>

        {/* Lock icon with animation */}
        <div className="mb-8 transform animate-fade-in-up delay-400">
          <div className="relative inline-block">
            <Lock className="w-8 h-8 text-gray-400 animate-pulse" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center transform animate-fade-in-up delay-500">
          <button
            onClick={() => window.history.back()}
            className="group relative px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
              Go Back
            </div>
          </button>

          <button
            onClick={() => window.location.href = '/home'}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-2">
              <Home className="w-5 h-5 group-hover:animate-pulse" />
              Home
            </div>
          </button>
        </div>

        {/* Contact info */}
        <div className="mt-8 transform animate-fade-in-up delay-600">
          <p className="text-gray-400 text-sm">
            {reason === 'not_verified' 
              ? "Complete your document verification to access driver features"
              : "Need access? Contact administrator for assistance"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;
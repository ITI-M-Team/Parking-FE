import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/images/background-home.png"; // Your original background

const Home = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isSuperUser, setIsSuperUser] = useState(false);

  // Check authentication status
  useEffect(() => {
    const localToken = localStorage.getItem("authTokens");
    const sessionToken = sessionStorage.getItem("authTokens");
    
    if (localToken || sessionToken) {
      try {
        const tokenData = JSON.parse(localToken || sessionToken);
        setIsAuthenticated(true);
        setUserRole(tokenData?.role);
        setVerificationStatus(tokenData?.verification_status);
        setIsSuperUser(tokenData?.is_superuser || false);
      } catch (error) {
        console.error("Error parsing token:", error);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Redirect based on user role and verification status
      if (isSuperUser) {
        navigate("/admin");
      } else if (verificationStatus === "Pending" || verificationStatus === "Rejected") {
        navigate("/settings");
      } else if (verificationStatus === "Verified") {
        if (userRole === "driver") {
          navigate("/nearby-garages");
        } else if (userRole === "garage_owner") {
          navigate("/dashboard/owner");
        } else {
          navigate("/profile");
        }
      } else {
        navigate("/profile");
      }
    } else {
      navigate("/register");
    }
  };

  const handleExploreFeatures = () => {
    if (isAuthenticated) {
      if (userRole === "driver") {
        navigate("/nearby-garages");
      } else if (userRole === "garage_owner") {
        navigate("/garage/register");
      } else {
        navigate("/manual");
      }
    } else {
      navigate("/manual");
    }
  };

  const getWelcomeMessage = () => {
    if (!isAuthenticated) {
      return {
        title: "Welcome to Parkly",
        subtitle: "Your smart solution to finding nearby parking spots, booking them in real-time, and managing your garage efficiently — all in one platform."
      };
    }

    if (isSuperUser) {
      return {
        title: "Welcome Back, Administrator",
        subtitle: "Manage the entire Smart Parking platform with full administrative access."
      };
    }

    if (verificationStatus === "Pending") {
      return {
        title: "Welcome! Complete Your Verification",
        subtitle: "Your account is pending verification. Please upload the required documents to access all features."
      };
    }

    if (verificationStatus === "Rejected") {
      return {
        title: "Account Verification Required",
        subtitle: "Your verification was rejected. Please re-upload the required documents to continue using our services."
      };
    }

    if (userRole === "driver") {
      return {
        title: "Welcome Back, Driver!",
        subtitle: "Ready to find the perfect parking spot? Discover nearby garages and book your space instantly."
      };
    }

    if (userRole === "garage_owner") {
      return {
        title: "Welcome Back, Garage Owner!",
        subtitle: "Manage your parking spaces efficiently and maximize your revenue with our smart platform."
      };
    }

    return {
      title: "Welcome Back!",
      subtitle: "Continue your smart parking journey with us."
    };
  };

  const getActionButtons = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGetStarted}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button
            onClick={() => navigate("/manual")}
            className={`px-8 py-4 border-2 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 ${
              darkMode 
                ? "border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900" 
                : "border-white text-white hover:bg-white hover:text-gray-800"
            }`}
          >
            How it Works
          </button>
        </div>
      );
    }

    if (isSuperUser) {
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/admin")}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Admin Dashboard</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button
            onClick={() => navigate("/nearby-garages")}
            className={`px-8 py-4 border-2 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 ${
              darkMode 
                ? "border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900" 
                : "border-white text-white hover:bg-white hover:text-gray-800"
            }`}
          >
            Explore Platform
          </button>
        </div>
      );
    }

    if (verificationStatus === "Pending" || verificationStatus === "Rejected") {
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/settings")}
            className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Complete Verification</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button
            onClick={() => navigate("/manual")}
            className={`px-8 py-4 border-2 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 ${
              darkMode 
                ? "border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900" 
                : "border-white text-white hover:bg-white hover:text-gray-800"
            }`}
          >
            Learn More
          </button>
        </div>
      );
    }
     
    if (userRole === "driver") {
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/nearby-garages")}
            className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Find Parking</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button
            onClick={() => navigate("/currentbooking")}
            className={`px-8 py-4 border-2 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 ${
              darkMode 
                ? "border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900" 
                : "border-white text-white hover:bg-white hover:text-gray-800"
            }`}
          >
            My Bookings
          </button>
        </div>
      );
    }

    if (userRole === "garage_owner") {
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/dashboard/owner")}
            className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">My Dashboard</span>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button
            onClick={() => navigate("/garage/register")}
            className={`px-8 py-4 border-2 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 ${
              darkMode 
                ? "border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900" 
                : "border-white text-white hover:bg-white hover:text-gray-800"
            }`}
          >
            Add New Garage
          </button>
        </div>
      );
    }

    // Default for verified users
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={handleGetStarted}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">Continue</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        <button
          onClick={() => navigate("/manual")}
          className={`px-8 py-4 border-2 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 ${
            darkMode 
              ? "border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900" 
              : "border-white text-white hover:bg-white hover:text-gray-800"
          }`}
        >
          How it Works
        </button>
      </div>
    );
  };

  const welcomeData = getWelcomeMessage();

  return (
    <div
      className="relative flex flex-col min-h-screen bg-cover bg-center text-white transition-all duration-500"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dynamic overlay that changes with theme */}
      <div className={`absolute inset-0 z-0 transition-all duration-500 ${
        darkMode 
          ? "bg-black/70" 
          : "bg-black/60"
      }`} />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-5">
        {/* Floating Circles */}
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full blur-xl opacity-20 animate-pulse ${
          darkMode ? "bg-blue-400" : "bg-white"
        }`}></div>
        <div className={`absolute top-60 right-20 w-48 h-48 rounded-full blur-xl opacity-20 animate-pulse ${
          darkMode ? "bg-purple-400" : "bg-white"
        }`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute bottom-40 left-1/4 w-24 h-24 rounded-full blur-xl opacity-20 animate-pulse ${
          darkMode ? "bg-pink-400" : "bg-white"
        }`} style={{ animationDelay: '4s' }}></div>
        
        {/* Grid Pattern */}
        <div className={`absolute inset-0 opacity-5 ${
          darkMode 
            ? "bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)]" 
            : "bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_1px,transparent_0)]"
        }`} style={{ backgroundSize: '50px 50px' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow px-4 sm:px-8 md:px-12 py-12 flex flex-col items-center justify-center text-center">
          {/* Hero Section */}
          <section className="mb-16 max-w-4xl">
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent ${
              darkMode 
                ? "from-white via-blue-200 to-purple-200" 
                : "from-white via-yellow-100 to-white"
            } drop-shadow-2xl animate-fade-in`}>
              {welcomeData.title}
            </h1>
            <p className={`text-xl md:text-2xl leading-relaxed mb-8 ${
              darkMode ? "text-gray-200" : "text-white/90"
            } drop-shadow-lg`}>
              {welcomeData.subtitle}
            </p>
            
            {getActionButtons()}

            {/* Verification Status Indicator */}
            {isAuthenticated && !isSuperUser && (
              <div className="mt-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                  verificationStatus === "Verified" 
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : verificationStatus === "Pending"
                    ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    verificationStatus === "Verified" 
                      ? "bg-green-400"
                      : verificationStatus === "Pending"
                      ? "bg-yellow-400 animate-pulse"
                      : "bg-red-400"
                  }`} />
                  Account Status: {verificationStatus || "Unknown"}
                </div>
              </div>
            )}
          </section>

          {/* Features Section */}
          {(!isAuthenticated || verificationStatus === "Verified") && (
            <section className="mb-16 max-w-6xl">
              <div className="grid md:grid-cols-3 gap-8">
                <div className={`backdrop-blur-sm rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl border ${
                  darkMode 
                    ? "bg-white/5 border-white/10 hover:bg-white/10" 
                    : "bg-white/10 border-white/20 hover:bg-white/20"
                }`}>
                  <div className="text-4xl mb-4 animate-bounce">🚗</div>
                  <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-white"}`}>
                    For Drivers
                  </h3>
                  <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-200"}`}>
                    Find and book nearby parking spots instantly with real-time availability.
                  </p>
                  {!isAuthenticated && (
                    <button
                      onClick={() => navigate("/register")}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Join as Driver
                    </button>
                  )}
                </div>
                
                <div className={`backdrop-blur-sm rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl border ${
                  darkMode 
                    ? "bg-white/5 border-white/10 hover:bg-white/10" 
                    : "bg-white/10 border-white/20 hover:bg-white/20"
                }`}>
                  <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: '0.5s' }}>🏢</div>
                  <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-white"}`}>
                    For Garage Owners
                  </h3>
                  <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-200"}`}>
                    Manage your parking spaces efficiently and maximize your revenue.
                  </p>
                  {!isAuthenticated && (
                    <button
                      onClick={() => navigate("/register")}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Join as Owner
                    </button>
                  )}
                </div>
                
                <div className={`backdrop-blur-sm rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl border ${
                  darkMode 
                    ? "bg-white/5 border-white/10 hover:bg-white/10" 
                    : "bg-white/10 border-white/20 hover:bg-white/20"
                }`}>
                  <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: '1s' }}>📱</div>
                  <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-white"}`}>
                    Smart Platform
                  </h3>
                  <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-200"}`}>
                    All-in-one solution with real-time updates and seamless booking experience.
                  </p>
                  <button
                    onClick={() => navigate("/manual")}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section className="max-w-xl">
            <h3 className={`text-2xl font-semibold mb-4 ${darkMode ? "text-white" : "text-white"} drop-shadow`}>
              Contact Us
            </h3>
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-200"}`}>
              Email:{" "}
              <a
                href="mailto:appparking653@gmail.com"
                className="text-cyan-300 underline hover:text-cyan-200 transition-colors duration-300"
              >
                appparking653@gmail.com
              </a>
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className={`px-4 sm:px-8 md:px-12 py-6 text-center border-t ${
          darkMode ? "border-white/10" : "border-white/20"
        }`}>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-300"}`}>
            © 2025 Smart Parking App. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
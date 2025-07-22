
// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { User, LogOut, Moon, Sun, Menu, X, PlusCircle, QrCode } from 'lucide-react';
// import instance from "../apis/config.js"
// const Header = ({ darkMode, setDarkMode }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userProfile, setUserProfile] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
// // ////////////////////
// // Check authentication status on component mount
//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);
// ////////////////////// Load user info //////////////
// const fetchUserInfo = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       // Get token from storage
//       const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
//       const token = storedToken ? JSON.parse(storedToken).access : null;
      
//       if (!token) {
//         setError('Authentication token not found. Please login again.');
//         setIsLoggedIn(false);
//         setUserProfile(null);
//         setLoading(false);
//         return;
//       }

//       // Make request to get user info
//       const response = await instance.get('/user-info/', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         }
//       });

//       const userData = response.data;
//       setUserProfile(userData);
//       setIsLoggedIn(true);
//     } catch (err) {
//       console.error('Error fetching user info:', err);
//       if (err.response?.status === 401) {
//         setError('Authentication failed. Please login again.');
//         // Clear invalid token
//         localStorage.removeItem('authTokens');
//         sessionStorage.removeItem('authTokens');
//         setIsLoggedIn(false);
//         setUserProfile(null);
//       } else {
//         setError('Failed to fetch user information. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
// //////////------------------/////////////
//   const checkAuthStatus = () => {
//     // Check both localStorage and sessionStorage for authTokens
//     const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
    
//     if (storedToken) {
//       try {
//         const tokenData = JSON.parse(storedToken);
//         if (tokenData.access) {
//           // Token exists, fetch user info
//           fetchUserInfo();
//         } else {
//           setIsLoggedIn(false);
//           setUserProfile(null);
//         }
//       } catch (error) {
//         console.error('Error parsing auth tokens:', error);
//         setIsLoggedIn(false);
//         setUserProfile(null);
//         // Clear invalid token
//         localStorage.removeItem('authTokens');
//         sessionStorage.removeItem('authTokens');
//       }
//     } else {
//       setIsLoggedIn(false);
//       setUserProfile(null);
//     }
//   };
// // /////////
//   const handleLogout = () => {
//       // Clear authentication data
//       localStorage.removeItem('authTokens');
//       sessionStorage.removeItem('authTokens');
      
//       // Update state
//       setIsLoggedIn(false);
//       setUserProfile(null);
//       setShowDropdown(false);
      
//       // Redirect to login or home
//       navigate('/login');
//     };

// // ////
//  const toggleTheme = () => {
//     const newDarkMode = !darkMode;
//     setDarkMode(newDarkMode);
//     document.documentElement.classList.toggle("dark", newDarkMode);
//     localStorage.setItem("theme", newDarkMode ? "dark" : "light");
//   };

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   const toggleMobileMenu = () => {
//     setShowMobileMenu(!showMobileMenu);
//   };


//   // Get user initials for avatar
//   const getUserInitials = () => {
//     if (userProfile?.username) {
//       return userProfile.username.charAt(0).toUpperCase();
//     }
//     return 'U';
//   };

//   // Check if user is garage owner or superuser
//     const isGarageOwner = () => {
//       return userProfile?.role === 'garage_owner' || userProfile?.role === 'owner' || userProfile?.is_superuser;
//     };

//   return (
//     <header className={`shadow-sm border-b px-4 sm:px-6 py-4 transition-colors sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//       <div className="max-w-full mx-auto">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-4">{/* Logo */}
//           {/* Logo */}
//           <div className="flex items-center gap-3 flex-wrap">
//             <Link to="/nearby-garages" className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">P</span>
//               </div>
//               <span className={`text-xl font-bold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                 ParkApp
//               </span>
//             </Link>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center space-x-8 ml-8">
//               <Link 
//                 to="/home" 
//                 className={`transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
//               >
//                 Home
//               </Link>
//               <Link 
//                 to="/nearby-garages" 
//                 className={`transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
//               >
//                 Find Garages
//               </Link>
//               {isLoggedIn && (
//                 <Link 
//                   to="/currentbooking" 
//                   className={`transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
//                 >
//                   My Bookings
//                 </Link>
//               )}
//               {/* Garage Owner specific links */}
//                  {isLoggedIn && isGarageOwner() && (
//                 <>
//                   <Link 
//                     to="/garage/register" 
//                     className={`flex items-center space-x-1 transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
//                   >
//                     <PlusCircle className="w-4 h-4" />
//                     <span>Add Garage</span>
//                   </Link>
//                   <Link 
//                     to="/scanner" 
//                     className={`flex items-center space-x-1 transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
//                   >
//                     <QrCode className="w-4 h-4" />
//                     <span>Scanner</span>
//                   </Link>
//                 </>
//               )}
//             </nav>
//           </div>

//           {/* Right side actions */}
//           <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
//             {/* Theme Toggle */}
//             <button
//               onClick={toggleTheme}
//               className={`px-4 py-2 text-sm rounded-md transition hover:scale-105 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300 text-gray-900 hover:bg-gray-200'}`}
//             >
//               {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
//             </button>

//             {/* Authentication-based rendering */}
//             {isLoggedIn ? (
//               <>
//                 <span className={`text-sm transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                   {userProfile?.username || 'User'}
//                 </span>
                
//                 {/* User Profile Dropdown */}
//                 <div className="relative" ref={dropdownRef}>
//                   <button
//                     onClick={toggleDropdown}
//                     className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//                     aria-label="User menu"
//                   >
//                     {userProfile?.profile_image ? (
//                       <img
//                         src={userProfile.profile_image}
//                         alt="Profile"
//                         className="w-8 h-8 rounded-full object-cover border border-white shadow"
//                       />
//                     ) : (
//                       <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
//                         <span className="text-white text-sm font-medium">
//                           {getUserInitials()}
//                         </span>
//                       </div>
//                     )}
//                   </button>

//                   {/* Dropdown Menu */}
//                   {showDropdown && (
//                     <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//                       <Link
//                         to="/profile"
//                         className={`flex items-center px-4 py-2 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                         onClick={() => setShowDropdown(false)}
//                       >
//                         <User className="w-4 h-4 mr-3" />
//                         Profile
//                       </Link>
//                       <Link
//                         to="/settings"
//                         className={`flex items-center px-4 py-2 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                         onClick={() => setShowDropdown(false)}
//                       >
//                         <User className="w-4 h-4 mr-3" />
//                         Settings
//                       </Link>
//                       {/* Garage Owner Dashboard Links in Dropdown */}
//                       {isGarageOwner() && (
//                         <>
//                           <hr className={`border-gray-200 dark:border-gray-700 my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
//                           <Link
//                             to="/dashboard/owner"
//                             className={`flex items-center px-4 py-2 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                             onClick={() => setShowDropdown(false)}
//                           >
//                             <User className="w-4 h-4 mr-3" />
//                             Dashboard
//                           </Link>
//                           {/* <Link
//                             to="/dashboard/garage"
//                             className={`flex items-center px-4 py-2 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                             onClick={() => setShowDropdown(false)}
//                           >
//                             <User className="w-4 h-4 mr-3" />
//                             Garage Dashboard
//                           </Link> */}
//                         </>
//                       )}
//                       <hr className={`border-gray-200 dark:border-gray-700 my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
//                       <button
//                         onClick={handleLogout}
//                         className={`flex items-center w-full text-left px-4 py-2 text-red-600 dark:text-red-400 transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//                       >
//                         <LogOut className="w-4 h-4 mr-3" />
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               /* Login/Register buttons for non-authenticated users */
//               <div className="hidden sm:flex items-center space-x-3">
//                 <Link
//                   to="/login"
//                   className={`px-4 py-2 transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             )}

//             {/* Mobile menu button */}
//             <button
//               onClick={toggleMobileMenu}
//               className={`md:hidden p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//               aria-label="Toggle mobile menu"
//             >
//               {showMobileMenu ? (
//                 <X className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
//               ) : (
//                 <Menu className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {showMobileMenu && (
//           <div className={`md:hidden border-t py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//             <nav className="flex flex-col space-y-2">
//               <Link
//                 to="/home"
//                 className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                 onClick={() => setShowMobileMenu(false)}
//               >
//                 Home
//               </Link>
//               <Link
//                 to="/nearby-garages"
//                 className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                 onClick={() => setShowMobileMenu(false)}
//               >
//                 Find Garages
//               </Link>
//               {isLoggedIn ? (
//                 <>
//                   <Link
//                     to="/currentbooking"
//                     className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                     onClick={() => setShowMobileMenu(false)}
//                   >
//                     My Bookings
//                   </Link>

//                    {/* Garage Owner Mobile Links */}
//                   {isGarageOwner() && (
//                     <>
//                       <Link
//                         to="/garage/register"
//                         className={`flex items-center px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                         onClick={() => setShowMobileMenu(false)}
//                       >
//                         <PlusCircle className="w-4 h-4 mr-3" />
//                         Add Garage
//                       </Link>
//                       <Link
//                         to="/scanner"
//                         className={`flex items-center px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                         onClick={() => setShowMobileMenu(false)}
//                       >
//                         <QrCode className="w-4 h-4 mr-3" />
//                         Scanner
//                       </Link>
//                       <Link
//                         to="/dashboard/owner"
//                         className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                         onClick={() => setShowMobileMenu(false)}
//                       >
//                         Dashboard
//                       </Link>
//                       {/* <Link
//                         to="/dashboard/garage"
//                         className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                         onClick={() => setShowMobileMenu(false)}
//                       >
//                         Garage Dashboard
//                       </Link> */}
//                     </>
//                   )}

//                   <Link
//                     to="/profile"
//                     className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                     onClick={() => setShowMobileMenu(false)}
//                   >
//                     Profile
//                   </Link>
//                   <Link
//                     to="/settings"
//                     className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                     onClick={() => setShowMobileMenu(false)}
//                   >
//                     Settings
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className={`text-left px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     to="/login"
//                     className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
//                     onClick={() => setShowMobileMenu(false)}
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     to="/register"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
//                     onClick={() => setShowMobileMenu(false)}
//                   >
//                     Sign Up
//                   </Link>
//                 </>
//               )}
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Moon, Sun, Menu, X, PlusCircle, QrCode } from 'lucide-react';
import instance from "../apis/config.js";
import { useLanguage } from '../context/LanguageContext';

const Header = ({ darkMode, setDarkMode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  
  const { language, setLanguage } = useLanguage();

  const t = {
    en: {
      home: 'Home',
      findGarages: 'Find Garages',
      myBookings: 'My Bookings',
      addGarage: 'Add Garage',
      scanner: 'Scanner',
      dashboard: 'Dashboard',
      profile: 'Profile',
      settings: 'Settings',
      login: 'Login',
      signUp: 'Sign Up',
      logout: 'Logout',
      lightMode: '☀ Light Mode',
      darkMode: '🌙 Dark Mode'
    },
    ar: {
      home: 'الرئيسية',
      findGarages: 'البحث عن جراج',
      myBookings: 'حجوزاتي',
      addGarage: 'إضافة جراج',
      scanner: 'الماسح الضوئي',
      dashboard: 'لوحة التحكم',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      login: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      logout: 'تسجيل الخروج',
      lightMode: '☀ الوضع النهاري',
      darkMode: '🌙 الوضع الليلي'
    }
  };


  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  ////////////////////// Load user info //////////////
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get token from storage
      const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
      const token = storedToken ? JSON.parse(storedToken).access : null;
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setIsLoggedIn(false);
        setUserProfile(null);
        setLoading(false);
        return;
      }

      // Make request to get user info
      const response = await instance.get('/user-info/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const userData = response.data;
      setUserProfile(userData);
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Error fetching user info:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        // Clear invalid token
        localStorage.removeItem('authTokens');
        sessionStorage.removeItem('authTokens');
        setIsLoggedIn(false);
        setUserProfile(null);
      } else {
        setError('Failed to fetch user information. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = () => {
    // Check both localStorage and sessionStorage for authTokens
    const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
    
    if (storedToken) {
      try {
        const tokenData = JSON.parse(storedToken);
        if (tokenData.access) {
          // Token exists, fetch user info
          fetchUserInfo();
        } else {
          setIsLoggedIn(false);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error parsing auth tokens:', error);
        setIsLoggedIn(false);
        setUserProfile(null);
        // Clear invalid token
        localStorage.removeItem('authTokens');
        sessionStorage.removeItem('authTokens');
      }
    } else {
      setIsLoggedIn(false);
      setUserProfile(null);
    }
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authTokens');
    sessionStorage.removeItem('authTokens');
    
    // Update state
    setIsLoggedIn(false);
    setUserProfile(null);
    setShowDropdown(false);
    
    // Redirect to login or home
    navigate('/login');
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userProfile?.username) {
      return userProfile.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Check if user is garage owner or superuser
  const isGarageOwner = () => {
    return userProfile?.role === 'garage_owner' || userProfile?.role === 'owner' || userProfile?.is_superuser;
  };

  return (
    <header className={`shadow-sm border-b px-4 sm:px-6 py-4 transition-colors sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/nearby-garages" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className={`text-xl font-bold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ParkApp
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-12 ml-8">
              <Link 
                to="/home" 
                className={`transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
              >
                {t[language].home}
              </Link>
              <Link 
                to="/nearby-garages" 
                className={`transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
              >
                {t[language].findGarages}
              </Link>
              {isLoggedIn && (
                <Link 
                  to="/currentbooking" 
                  className={`transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  {t[language].myBookings}
                </Link>
              )}
              {/* Garage Owner specific links */}
              {isLoggedIn && isGarageOwner() && (
                <>
                  <Link 
                    to="/garage/register" 
                    className={`flex items-center space-x-1 transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{t[language].addGarage}</span>
                  </Link>
                  <Link 
                    to="/scanner" 
                    className={`flex items-center space-x-1 transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>{t[language].scanner}</span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className={`px-4 py-2 text-sm rounded-md transition hover:scale-105 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300 text-gray-900 hover:bg-gray-200'}`}
                aria-label="Toggle language"
              >
                {language.toUpperCase()}
              </button>

              {/* Language Dropdown */}
              {showLangDropdown && (
                <div className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-32 rounded-lg shadow-lg border py-1 z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setShowLangDropdown(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    English (EN)
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ar');
                      setShowLangDropdown(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    العربية (AR)
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 text-sm rounded-md transition hover:scale-105 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300 text-gray-900 hover:bg-gray-200'}`}
            >
              {darkMode ? t[language].lightMode : t[language].darkMode}
            </button>

            {/* Authentication-based rendering */}
            {isLoggedIn ? (
              <>
                <span className={`text-sm transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {userProfile?.username || 'User'}
                </span>
                
                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    aria-label="User menu"
                  >
                    {userProfile?.profile_image ? (
                      <img
                        src={userProfile.profile_image}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border border-white shadow"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {getUserInitials()}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-48 rounded-lg shadow-lg border py-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <Link
                        to="/profile"
                        className={`flex items-center px-4 py-2 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className={`w-4 h-4 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                        {t[language].profile}
                      </Link>
                      <Link
                        to="/settings"
                        className={`flex items-center px-4 py-2 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className={`w-4 h-4 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                        {t[language].settings}
                      </Link>
                      {/* Garage Owner Dashboard Links in Dropdown */}
                      {isGarageOwner() && (
                        <>
                          <hr className={`border-gray-200 dark:border-gray-700 my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                          <Link
                            to="/dashboard/owner"
                            className={`flex items-center px-4 py-2 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setShowDropdown(false)}
                          >
                            <User className={`w-4 h-4 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                            {t[language].dashboard}
                          </Link>
                        </>
                      )}
                      <hr className={`border-gray-200 dark:border-gray-700 my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                      <button
                        onClick={handleLogout}
                        className={`flex items-center w-full text-left px-4 py-2 text-red-600 dark:text-red-400 transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <LogOut className={`w-4 h-4 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                        {t[language].logout}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Login/Register buttons for non-authenticated users */
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  {t[language].login}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t[language].signUp}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Toggle mobile menu"
            >
              {showMobileMenu ? (
                <X className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className={`md:hidden border-t py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/home"
                className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setShowMobileMenu(false)}
              >
                {t[language].home}
              </Link>
              <Link
                to="/nearby-garages"
                className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setShowMobileMenu(false)}
              >
                {t[language].findGarages}
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    to="/currentbooking"
                    className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t[language].myBookings}
                  </Link>

                  {/* Garage Owner Mobile Links */}
                  {isGarageOwner() && (
                    <>
                      <Link
                        to="/garage/register"
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <PlusCircle className={`w-4 h-4 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                        {t[language].addGarage}
                      </Link>
                      <Link
                        to="/scanner"
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <QrCode className={`w-4 h-4 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                        {t[language].scanner}
                      </Link>
                      <Link
                        to="/dashboard/owner"
                        className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {t[language].dashboard}
                      </Link>
                    </>
                  )}

                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t[language].profile}
                  </Link>
                  <Link
                    to="/settings"
                    className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t[language].settings}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`text-left px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                  >
                    {t[language].logout}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t[language].login}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t[language].signUp}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
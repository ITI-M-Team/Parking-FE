
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Moon, Sun, Menu, X, PlusCircle, QrCode, Globe } from 'lucide-react';
import instance from "../apis/config.js"
const Header = ({ darkMode, setDarkMode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTranslateReady, setIsTranslateReady] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const dropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const translateElementRef = useRef(null);
  const navigate = useNavigate();

  // Language options
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  useEffect(() => {
    checkAuthStatus();
    initializeGoogleTranslate();
    hideGoogleTranslateElements();
  }, []);

  //////////Start Language Section//////////
  // Hide Google Translate elements with CSS
  const hideGoogleTranslateElements = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Hide Google Translate banner and elements */
      .goog-te-banner-frame,
      .goog-te-menu-frame,
      .skiptranslate,
      #google_translate_element,
      .goog-logo-link,
      .goog-te-gadget,
      .goog-te-combo {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
        width: 0 !important;
        height: 0 !important;
      }
      
      /* Remove the Google Translate top banner */
      body {
        top: 0 !important;
        position: static !important;
      }
      
      /* Hide iframe created by Google Translate */
      iframe.goog-te-banner-frame {
        display: none !important;
      }
      
      /* Ensure body doesn't get pushed down */
      body.translated-ltr,
      body.translated-rtl {
        margin-top: 0 !important;
      }
      
      /* Hide any notification bars */
      .goog-te-banner-frame.skiptranslate {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  };

  const initializeGoogleTranslate = () => {
    // If already initialized, skip
    if (window.google && window.google.translate && isTranslateReady) {
      return;
    }

    // Clean up any previous initialization
    delete window.googleTranslateElementInit;

    // Create new initialization function
    window.googleTranslateElementInit = () => {
      try {
        // Remove any existing translate elements
        const existingElement = document.getElementById('google_translate_element');
        if (existingElement) {
          existingElement.innerHTML = '';
        }

        // Initialize the translate element (hidden)
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: languages.map(lang => lang.code).join(','),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          },
          'google_translate_element'
        );

        setIsTranslateReady(true);

        // Hide the translate elements after initialization
        setTimeout(() => {
          hideGoogleTranslateElements();
        }, 100);

      } catch (error) {
        console.error('Google Translate initialization error:', error);
        setIsTranslateReady(false);
      }
    };

    // Load the script if not already loaded
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement('script');
      script.src = `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
      script.async = true;
      script.onerror = () => {
        console.error('Failed to load Google Translate script');
        setIsTranslateReady(false);
      };
      document.body.appendChild(script);
    } else if (window.googleTranslateElementInit) {
      // If script already loaded, just initialize
      window.googleTranslateElementInit();
    }
  };

  // Simplified language change function
  const handleLanguageChange = (langCode) => {
    if (!isTranslateReady) return;

    try {
      // Method 1: Try to use the hidden select element
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = langCode;
        const event = new Event('change', { bubbles: true });
        select.dispatchEvent(event);
        setCurrentLang(langCode);
        setShowLanguageDropdown(false);
        return;
      }

      // Method 2: Use Google Translate API directly
      if (window.google && window.google.translate) {
        const translateInstance = new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: languages.map(lang => lang.code).join(','),
        });

        // Trigger translation
        if (langCode !== 'en') {
          // Use cookie method for translation
          document.cookie = `googtrans=/en/${langCode}; path=/`;
          window.location.reload();
        } else {
          // Reset to original language
          document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          window.location.reload();
        }
      }

      setCurrentLang(langCode);
      setShowLanguageDropdown(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Get current language info
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLang) || languages[0];
  };
  //////////End Language Section//////////

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
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
  //////////------------------/////////////
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
  // /////////
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

  // ////
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

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
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
  const currentLanguage = getCurrentLanguage();
  return (
    <>
      {/* Completely Hidden Google Translate Element */}
      <div
        id="google_translate_element"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '0',
          height: '0',
          overflow: 'hidden',
          visibility: 'hidden',
          display: 'none'
        }}
      ></div>
      <header className={`shadow-sm border-b px-4 sm:px-6 py-4 transition-colors sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-4">{/* Logo */}
            {/* Logo */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/nearby-garages" className="flex items-center space-x-2">
                <img
                  src="/src/assets/images/parkly-02.png"
                  alt="Parkly Logo"
                  className="w-20 h-20 object-contain"
                />
                <span className={`text-xl font-bold transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Parkly
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8 ml-8">
                <Link
                  to="/home"
                  className={`transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  Home
                </Link>
                <Link
                  to="/nearby-garages"
                  className={`transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  Find Garages
                </Link>
                {isLoggedIn && (
                  <Link
                    to="/currentbooking"
                    className={`transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                  >
                    My Bookings
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
                      <span>Add Garage</span>
                    </Link>
                    <Link
                      to="/scanner"
                      className={`flex items-center space-x-1 transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Scanner</span>
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              {/* Test translation */}
              <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={toggleLanguageDropdown}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition hover:scale-105 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } ${!isTranslateReady ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isTranslateReady}
                  title={!isTranslateReady ? "Translation loading..." : "Select language"}
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
                  <span className="sm:hidden">{currentLanguage.flag}</span>
                  {!isTranslateReady && <span className="animate-pulse">●</span>}
                </button>

                {/* Language Dropdown */}
                {showLanguageDropdown && isTranslateReady && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 max-h-60 overflow-y-auto z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full flex items-center px-4 py-2 text-left transition-colors ${currentLang === language.code
                            ? (darkMode ? 'bg-gray-600 text-blue-400' : 'bg-gray-100 text-blue-600')
                            : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
                          }`}
                      >
                        <span className="mr-3">{language.flag}</span>
                        <span>{language.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Test translation */}
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`px-4 py-2 text-sm rounded-md transition hover:scale-105 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300 text-gray-900 hover:bg-gray-200'}`}
              >
                {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
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
                      <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <Link
                          to="/profile"
                          className={`flex items-center px-4 py-2 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setShowDropdown(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className={`flex items-center px-4 py-2 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setShowDropdown(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        <Link
                        to="/wallet-topup"
                        className={`flex items-center px-4 py-2 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Wallet
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
                              <User className="w-4 h-4 mr-3" />
                              Dashboard
                            </Link>
                            {/* <Link
                            to="/dashboard/garage"
                            className={`flex items-center px-4 py-2 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setShowDropdown(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            Garage Dashboard
                          </Link> */}
                          </>
                        )}
                        <hr className={`border-gray-200 dark:border-gray-700 my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                        <button
                          onClick={handleLogout}
                          className={`flex items-center w-full text-left px-4 py-2 text-red-600 dark:text-red-400 transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
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
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
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
                {/* Mobile Language Selector */}
                <div className="px-4 py-2">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Language / اللغة
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.slice(0, 6).map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          handleLanguageChange(language.code);
                          setShowMobileMenu(false);
                        }}
                        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${currentLang === language.code
                            ? (darkMode ? 'bg-gray-600 text-blue-400' : 'bg-gray-200 text-blue-600')
                            : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                          }`}
                        disabled={!isTranslateReady}
                      >
                        <span className="mr-2">{language.flag}</span>
                        <span className="truncate">{language.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <hr className={`border-gray-200 dark:border-gray-700 my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />

                <Link
                  to="/home"
                  className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/nearby-garages"
                  className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Find Garages
                </Link>
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/currentbooking"
                      className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      My Bookings
                    </Link>

                    {/* Garage Owner Mobile Links */}
                    {isGarageOwner() && (
                      <>
                        <Link
                          to="/garage/register"
                          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <PlusCircle className="w-4 h-4 mr-3" />
                          Add Garage
                        </Link>
                        <Link
                          to="/scanner"
                          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <QrCode className="w-4 h-4 mr-3" />
                          Scanner
                        </Link>
                        <Link
                          to="/dashboard/owner"
                          className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          Dashboard
                        </Link>
                        {/* <Link
                        to="/dashboard/garage"
                        className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Garage Dashboard
                      </Link> */}
                      </>
                    )}

                    <Link
                      to="/profile"
                      className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`text-left px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;

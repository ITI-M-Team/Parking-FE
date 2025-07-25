import React, { useState } from 'react';
import { Users, Building2, Search, Filter, Loader2 } from 'lucide-react';
import UserVerificationComponent from '../components/AdminWrapper/UserVerificationComponent';
import GarageVerificationComponent from '../components/AdminWrapper/GarageVerificationComponent';

function AdminDashboard2({ darkMode, setDarkMode }) {
  const [activeTab, setActiveTab] = useState('users');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Configure API base URL
  const API_BASE_URL = 'http://localhost:8000/api';

  // Helper function to get auth token
  const getAuthToken = () => {
    const raw = localStorage.getItem('authTokens') || sessionStorage.getItem('authTokens');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed.access; 
    } catch {
      return null;
    }
  };

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  // Theme classes
  const themeClasses = {
    background: darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100',
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-600',
      muted: darkMode ? 'text-gray-400' : 'text-gray-500'
    },
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900',
    button: {
      primary: darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700',
      secondary: darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ease-in-out ${themeClasses.background}`}>
      {/* Header */}
      <div className={`${themeClasses.card} shadow-sm border-b`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2 sm:mr-3" />
              <h1 className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>Admin Dashboard</h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className={`text-xs sm:text-sm ${themeClasses.text.secondary}`}>
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-3 py-2 text-sm rounded-md transition-all duration-200 hover:scale-105 ${
                  darkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-8">
        {/* Tab Navigation */}
        <div className={`${themeClasses.card} shadow-lg rounded-lg mb-6 sm:mb-8`}>
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setActiveTab('users');
                setFilterStatus('all');
                setSearchTerm('');
              }}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'users'
                  ? `${themeClasses.text.primary} border-b-2 border-blue-600`
                  : `${themeClasses.text.secondary} hover:${themeClasses.text.primary}`
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-5 h-5" />
                <span>User Verification</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('garages');
                setFilterStatus('all');
                setSearchTerm('');
              }}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'garages'
                  ? `${themeClasses.text.primary} border-b-2 border-blue-600`
                  : `${themeClasses.text.secondary} hover:${themeClasses.text.primary}`
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Garage Registration</span>
              </div>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`${themeClasses.card} shadow-lg rounded-lg mb-6 sm:mb-8`}>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={activeTab === 'users' ? "Search by email, username, or phone..." : "Search by garage name, owner, or email..."}
                    className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 lg:w-80 ${themeClasses.input}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    className={`pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${themeClasses.input}`}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value={activeTab === 'users' ? 'verified' : 'approved'}>
                      {activeTab === 'users' ? 'Verified' : 'Approved'}
                    </option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'users' ? (
          <UserVerificationComponent
            darkMode={darkMode}
            filterStatus={filterStatus}
            searchTerm={searchTerm}
            themeClasses={themeClasses}
            API_BASE_URL={API_BASE_URL}
            getAuthHeaders={getAuthHeaders}
          />
        ) : (
          <GarageVerificationComponent
            darkMode={darkMode}
            filterStatus={filterStatus}
            searchTerm={searchTerm}
            themeClasses={themeClasses}
            API_BASE_URL={API_BASE_URL}
            getAuthHeaders={getAuthHeaders}
          />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard2;
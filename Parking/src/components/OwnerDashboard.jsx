import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertCircle, Loader, QrCode, Plus, Edit } from 'lucide-react';
import ownerDashboardApi from '../apis/ownerDashboardApi';
import DashboardStats from './OwnerDashboard/DashboardStats';
import TodaysBookingsTable from './OwnerDashboard/TodaysBookingsTable';
import UpdateSpotsForm from './OwnerDashboard/UpdateSpotsForm';
import ParkingSpotList from './OwnerDashboard/ParkingSpotList';

function OwnerDashboard({ darkMode, setDarkMode }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportEmail, setReportEmail] = useState(''); // new state
  const navigate = useNavigate();

  // Add custom animations styles
  const customStyles = `
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slide-in-right {
      from { 
        opacity: 0; 
        transform: translateX(20px); 
      }
      to { 
        opacity: 1; 
        transform: translateX(0); 
      }
    }
    
    @keyframes fade-in-up {
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
      animation: fade-in 0.6s ease-out;
    }
    
    .animate-slide-in-right {
      animation: slide-in-right 0.8s ease-out;
    }
    
    .animate-fade-in-up {
      animation: fade-in-up 0.8s ease-out;
      animation-fill-mode: both;
    }
  `;

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerDashboardApi.getDashboardData();
      if (data && data.length > 0) {
        setDashboardData(data[0]);
      } else {
        setError('No dashboard data found for this owner.');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err.response?.status === 403) {
        setError('Access Denied: You are not authorized to view this dashboard.');
      } else if (err.response?.status === 404) {
        setError('No garages found for your account.');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in.');
      } else {
        setError(err.response?.data?.detail || 'Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateSuccess = () => {
    fetchDashboardData();
  };

  const handleQRCodeScan = () => {
    navigate('/scanner');
  };

  const handleAddGarage = () => {
    navigate('/garage/register');
  };

  const handleEditGarage = () => {
    navigate(`/garage/edit/${dashboardData.id}`);
  };

  const handleSendReport = async () => {
    const emailToSend = reportEmail.trim() || dashboardData?.owner_email;

    if (!dashboardData?.id || !emailToSend) {
      alert('Garage ID or Email is missing.');
      return;
    }

    try {
      const result = await ownerDashboardApi.sendWeeklyReport(
        dashboardData.id,
        emailToSend
      );
      alert(result.message || 'Report sent successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send report.');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-2 font-inter ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center animate-pulse">
          <Loader className={`w-12 h-12 animate-spin mx-auto mb-4 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-2 font-inter ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center max-w-md mx-auto p-5 animate-fade-in">
          <AlertCircle className={`w-16 h-16 mx-auto mb-4 animate-bounce ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Error</h2>
          <p className={`mb-5 text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg transform"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{customStyles}</style>
      <div className={`min-h-screen transition-all duration-300 font-inter ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 py-3 sm:py-4">
          {dashboardData && (
            <>
              {/* Header with title and action buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 space-y-4 sm:space-y-0 animate-fade-in">
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {dashboardData.name} Dashboard
                </h1>
                
                {/* Action buttons - responsive layout */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 animate-slide-in-right">
                  <button
                    onClick={handleAddGarage}
                    className="flex items-center space-x-2 px-4 py-2.5 text-sm sm:text-base rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg transform"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Add Garage</span>
                    <span className="xs:hidden">Add</span>
                  </button>
                  
                  <button
                    onClick={handleEditGarage}
                    className="flex items-center space-x-2 px-4 py-2.5 text-sm sm:text-base rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg transform"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Edit Garage</span>
                    <span className="xs:hidden">Edit</span>
                  </button>
                  
                  <button
                    onClick={handleQRCodeScan}
                    className="flex items-center space-x-2 px-4 py-2.5 text-sm sm:text-base rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg transform"
                  >
                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Scan QR</span>
                    <span className="sm:hidden">QR</span>
                  </button>

                  {/* Weekly Report Section */}
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={reportEmail}
                      onChange={(e) => setReportEmail(e.target.value)}
                      placeholder="Report email"
                      className={`px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <button
                      onClick={handleSendReport}
                      className="px-4 py-2 text-sm rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg transform"
                    >
                      <span className="hidden sm:inline">Weekly Report</span>
                      <span className="sm:hidden">Report</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Dashboard Stats */}
              <div className="mb-5 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <DashboardStats darkMode={darkMode} garageData={dashboardData} />
              </div>

              {/* Two column layout for medium screens and up, single column for mobile */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-5 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="order-1 xl:order-1 transition-all duration-300 hover:scale-[1.01] transform">
                  <TodaysBookingsTable darkMode={darkMode} bookings={dashboardData.today_bookings} />
                </div>
                <div className="order-2 xl:order-2 transition-all duration-300 hover:scale-[1.01] transform">
                  <UpdateSpotsForm
                    darkMode={darkMode}
                    garageId={dashboardData.id}
                    onUpdateSuccess={handleUpdateSuccess}
                  />
                </div>
              </div>

              {/* Parking Spot List */}
              <div className="mb-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <ParkingSpotList darkMode={darkMode} spots={dashboardData.spots} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OwnerDashboard;
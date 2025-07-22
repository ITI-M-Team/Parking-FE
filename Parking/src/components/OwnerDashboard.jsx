
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
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <Loader className={`w-12 h-12 animate-spin mx-auto mb-4 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
          <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Error</h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto p-6">
        {dashboardData && (
          <>
            {/* Garage name and Action buttons */}
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {dashboardData.name} Dashboard
              </h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleAddGarage}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                    darkMode 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Garage</span>
                </button>
                <button
                  onClick={handleEditGarage}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                    darkMode 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit Garage</span>
                </button>
                <button
                  onClick={handleQRCodeScan}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>Scan QR Code</span>
                </button>
              </div>
            </div>

            <DashboardStats darkMode={darkMode} garageData={dashboardData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <TodaysBookingsTable darkMode={darkMode} bookings={dashboardData.today_bookings} />
              <UpdateSpotsForm
                darkMode={darkMode}
                garageId={dashboardData.id}
                onUpdateSuccess={handleUpdateSuccess}
              />
            </div>
            
            <ParkingSpotList darkMode={darkMode} spots={dashboardData.spots} />
          </>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
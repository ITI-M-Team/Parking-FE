import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import ownerDashboardApi from '../../apis/ownerDashboardApi';
import OwnerDashboard from '../OwnerDashboard';

const OwnerDashboardWrapper = ({ darkMode, setDarkMode }) => {
  const [loading, setLoading] = useState(true);
  const [garages, setGarages] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await ownerDashboardApi.getDashboardData();
      
      if (!data || data.length === 0) {
        // No garages at all - redirect to registration
        setError('no_garages');
        setLoading(false);
        return;
      }
      
      setGarages(data);
      
      // Check if user has at least one verified garage
      const hasVerifiedGarage = data.some(garage => garage.verification_status === 'Verified');
      
      if (!hasVerifiedGarage) {
        // No verified garages - show verification status page
        setError('no_verified_garages');
        setLoading(false);
        return;
      }
      
      // User has verified garages - allow access to dashboard
      setLoading(false);
      
    } catch (err) {
      console.error('Error checking verification status:', err);
      setError('fetch_error');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="w-5 h-5" />;
      case 'Pending':
        return <Clock className="w-5 h-5" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'Verified':
        return 'Your garage has been verified and is ready to accept bookings.';
      case 'Pending':
        return 'Your garage is currently under review. This process usually takes 2-3 business days.';
      case 'Rejected':
        return 'Your garage verification was rejected. Please review the feedback and resubmit.';
      default:
        return 'Unknown verification status.';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Checking verification status...
          </p>
        </div>
      </div>
    );
  }

  // No garages - redirect to registration
  if (error === 'no_garages') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center text-center p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h2 className="text-2xl font-bold mb-4">No Garages Found</h2>
        <p className="text-lg mb-6 max-w-md">
          You need to register at least one garage before accessing the owner dashboard.
        </p>
        <button 
          onClick={() => navigate('/garage/register')} 
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Register Your First Garage
        </button>
      </div>
    );
  }

  // No verified garages - show verification status
  if (error === 'no_verified_garages') {
    const verifiedCount = garages.filter(g => g.verification_status === 'Verified').length;
    const pendingCount = garages.filter(g => g.verification_status === 'Pending').length;
    const rejectedCount = garages.filter(g => g.verification_status === 'Rejected').length;

    return (
      <div className={`min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Clock className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-3xl font-bold mb-2">Garage Verification Status</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your garages are currently under review. You'll be able to access the dashboard once at least one garage is verified.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Total Garages</h3>
                <div className="text-2xl font-bold">{garages.length}</div>
              </div>
            </div>
            
            <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Pending Review</h3>
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              </div>
            </div>
            
            <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Rejected</h3>
                <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
              </div>
            </div>
          </div>

          {/* Garage List */}
          <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-6">Your Garages</h2>
            <div className="space-y-4">
              {garages.map((garage) => (
                <div 
                  key={garage.id}
                  className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{garage.name}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {garage.address}
                      </p>
                      <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {getStatusMessage(garage.verification_status)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(garage.verification_status)}`}>
                        {getStatusIcon(garage.verification_status)}
                        <span>{garage.verification_status}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/garage/edit/${garage.id}`)}
                          className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                            darkMode 
                              ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                              : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/garage/verification-status/${garage.id}`)}
                          className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/garage/register')} 
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Another Garage
            </button>
            
            <button 
              onClick={() => checkVerificationStatus()} 
              className={`px-6 py-3 font-medium rounded-lg border transition-colors ${
                darkMode 
                  ? 'border-gray-600 hover:bg-gray-700 text-white' 
                  : 'border-gray-300 hover:bg-gray-100 text-gray-900'
              }`}
            >
              Refresh Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error occurred
  if (error === 'fetch_error') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center text-center p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
        <p className="text-lg mb-6 max-w-md">
          We couldn't load your garage information. Please try again.
        </p>
        <button 
          onClick={() => checkVerificationStatus()} 
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // User has verified garages - render the dashboard
  return <OwnerDashboard darkMode={darkMode} setDarkMode={setDarkMode} />;
};

export default OwnerDashboardWrapper;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Edit,
  Building2,
  Mail,
  Phone,
  ArrowLeft,
  FileText,
  Calendar,
  MapPin
} from 'lucide-react';
import ownerDashboardApi from '../../apis/ownerDashboardApi.js'; // Import the API service

function GarageVerificationStatusPage({ darkMode }) {
  const { garageId } = useParams();
  const navigate = useNavigate();
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVerificationStatus = async () => {
    if (!garageId) {
      setError('No garage ID provided');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Use the ownerDashboardApi service instead of direct fetch
      const data = await ownerDashboardApi.getGarageVerificationStatus(garageId);
      setVerificationData(data);
    } catch (err) {
      console.error('Error fetching verification status:', err);
      
      // More detailed error handling
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.error || err.response.data?.detail || 'Unknown error';
        
        if (status === 404) {
          setError('Garage not found or you do not have permission to view it');
        } else if (status === 401) {
          setError('You need to log in to view this page');
          // Optionally redirect to login
          // navigate('/login');
        } else if (status === 403) {
          setError('You do not have permission to view this garage');
        } else {
          setError(`Server error: ${message}`);
        }
      } else if (err.request) {
        setError('Network error: Could not connect to server');
      } else {
        setError('Failed to check verification status');
      }
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  fetchVerificationStatus();
  
  // Set up polling to check status every 30 seconds if pending
  const pollInterval = setInterval(() => {
    if (verificationData?.verification_status === 'Pending') {
      fetchVerificationStatus();
    }
  }, 30000);

  return () => clearInterval(pollInterval);
}, [garageId]);

    useEffect(() => {
    if (verificationData?.verification_status === 'Verified') {
            // Notify parent components about status change
            localStorage.setItem('garageVerificationUpdate', JSON.stringify({
            garageId: garageId,
            status: 'Verified',
            timestamp: Date.now()
            }));
            
            // Show success message for 3 seconds then redirect
            const redirectTimer = setTimeout(() => {
            navigate('/dashboard/owner');
            }, 3000);

            return () => clearTimeout(redirectTimer);
        }
    }, [verificationData?.verification_status, garageId, navigate]);
    
    const handleBackToDashboard = () => {
    sessionStorage.removeItem('fromVerificationCheck');
    
    if (verificationData?.verification_status === 'Verified') {
        navigate('/dashboard/owner');
    } else {
        sessionStorage.setItem('fromVerificationCheck', 'true');
        navigate('/dashboard/owner');
    }
    };
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Verified':
        return {
          icon: <CheckCircle className="w-20 h-20 text-green-500" />,
          title: 'Garage Verified!',
          description: 'Congratulations! Your garage has been verified and is now live for bookings.',
          bgColor: darkMode ? 'bg-green-900/20' : 'bg-green-50',
          borderColor: 'border-green-500',
          textColor: darkMode ? 'text-green-400' : 'text-green-700',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'Pending':
        return {
          icon: <Clock className="w-20 h-20 text-yellow-500" />,
          title: 'Verification Pending',
          description: 'Your garage is currently under review by our team. This process usually takes 24-48 hours.',
          bgColor: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50',
          borderColor: 'border-yellow-500',
          textColor: darkMode ? 'text-yellow-400' : 'text-yellow-700',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'Rejected':
        return {
          icon: <XCircle className="w-20 h-20 text-red-500" />,
          title: 'Verification Rejected',
          description: 'Your garage application was rejected. Please review the feedback below and update your garage information.',
          bgColor: darkMode ? 'bg-red-900/20' : 'bg-red-50',
          borderColor: 'border-red-500',
          textColor: darkMode ? 'text-red-400' : 'text-red-700',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
      default:
        return {
          icon: <AlertTriangle className="w-20 h-20 text-gray-500" />,
          title: 'Unknown Status',
          description: 'Unable to determine verification status.',
          bgColor: darkMode ? 'bg-gray-800' : 'bg-gray-50',
          borderColor: 'border-gray-500',
          textColor: darkMode ? 'text-gray-400' : 'text-gray-700',
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const themeClasses = {
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: {
      primary: darkMode ? 'text-white' : 'text-gray-900',
      secondary: darkMode ? 'text-gray-300' : 'text-gray-600',
      muted: darkMode ? 'text-gray-400' : 'text-gray-500'
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Checking verification status...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Error
          </h2>
          <p className={`mb-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {error}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchVerificationStatus}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard/owner')}
              className={`px-6 py-3 rounded-lg border transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!verificationData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No verification data found
          </p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(verificationData.verification_status);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard/owner')}
          className={`mb-6 inline-flex items-center space-x-2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Main Status Card */}
        <div className={`rounded-lg border-2 ${statusInfo.borderColor} ${statusInfo.bgColor} p-8 text-center mb-8`}>
          <div className="mb-6">
            {statusInfo.icon}
          </div>
          
          <h1 className={`text-3xl font-bold mb-4 ${statusInfo.textColor}`}>
            {statusInfo.title}
          </h1>
          
          <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {statusInfo.description}
          </p>

          {/* Garage Information */}
          <div className={`mb-6 p-6 rounded-lg ${themeClasses.card} border max-w-md mx-auto`}>
            <div className="flex items-center justify-center mb-3">
              <Building2 className="w-6 h-6 mr-2 text-gray-500" />
              <span className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                {verificationData.garage_name}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className={themeClasses.text.secondary}>
                  Submitted: {new Date(verificationData.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {verificationData.verification_status === 'Rejected' && (
              <button
                onClick={() => navigate(`/garage/edit/${garageId}`)}
                className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                <Edit className="w-5 h-5" />
                Update & Resubmit Garage
              </button>
            )}
            
            <button
              onClick={fetchVerificationStatus}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Status
            </button>
            
            <button
              onClick={() => navigate('/dashboard/owner')}
              className={`px-6 py-3 rounded-lg border transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Status-specific Information */}
        {verificationData.verification_status === 'Pending' && (
          <div className={`${themeClasses.card} rounded-lg border p-6 mb-8`}>
            <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}>
              What happens next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">1</span>
                </div>
                <p className={themeClasses.text.secondary}>
                  Our team will review your garage details and documentation
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">2</span>
                </div>
                <p className={themeClasses.text.secondary}>
                  You'll receive an email notification once the review is complete
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <p className={themeClasses.text.secondary}>
                  If approved, your garage will be live and available for bookings
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">4</span>
                </div>
                <p className={themeClasses.text.secondary}>
                  If rejected, you'll receive detailed feedback and can resubmit
                </p>
              </div>
            </div>
          </div>
        )}

        {verificationData.verification_status === 'Rejected' && verificationData.reason && (
          <div className={`${themeClasses.card} rounded-lg border border-red-200 p-6 mb-8`}>
            <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text.primary} flex items-center`}>
              <FileText className="w-5 h-5 mr-2 text-red-500" />
              Rejection Reason
            </h3>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/20' : 'bg-red-50'} border border-red-200`}>
              <p className={`${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                {verificationData.reason}
              </p>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>What to do:</strong> Please address the issues mentioned above, 
                update your garage information, and resubmit for review. Our team will 
                prioritize resubmissions for faster processing.
              </p>
            </div>
          </div>
        )}

        {verificationData.verification_status === 'Verified' && (
          <div className={`${themeClasses.card} rounded-lg border p-6 mb-8`}>
            <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}>
              Your garage is now live!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-medium ${themeClasses.text.primary} mb-2`}>
                  Available Features
                </h4>
                <ul className={`text-sm ${themeClasses.text.secondary} space-y-1`}>
                  <li>• Garage is visible to customers</li>
                  <li>• Accept and manage bookings</li>
                  <li>• View occupancy analytics</li>
                  <li>• Use QR code scanner</li>
                  <li>• Receive booking notifications</li>
                </ul>
              </div>
              <div>
                <h4 className={`font-medium ${themeClasses.text.primary} mb-2`}>
                  Next Steps
                </h4>
                <ul className={`text-sm ${themeClasses.text.secondary} space-y-1`}>
                  <li>• Monitor your garage performance</li>
                  <li>• Respond to customer reviews</li>
                  <li>• Update pricing as needed</li>
                  <li>• Keep garage information current</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className={`${themeClasses.card} rounded-lg border p-6`}>
          <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
            Need Help?
          </h3>
          <p className={`${themeClasses.text.secondary} mb-4`}>
            If you have questions about the verification process or need assistance, 
            our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:support@parkly.com" 
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              <span>support@parkly.com</span>
            </a>
            <a 
              href="tel:+1234567890" 
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <Phone className="w-4 h-4" />
              <span>+201060810842</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GarageVerificationStatusPage;
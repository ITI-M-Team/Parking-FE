import React, { useState, useEffect } from 'react';
import {
  Users, CheckCircle, XCircle, Clock, Eye, Download, ChevronDown, ChevronUp,
  Loader2, AlertCircle, CheckCircle2, User, Phone, Mail, CreditCard, Car, IdCard
} from 'lucide-react';

function UserVerificationComponent({ 
  darkMode, 
  filterStatus, 
  searchTerm, 
  themeClasses,
  API_BASE_URL,
  getAuthHeaders 
}) {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [userStats, setUserStats] = useState({
    total_requests: 0,
    pending_requests: 0,
    verified_requests: 0,
    rejected_requests: 0,
    verification_rate: 0
  });
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionData, setActionData] = useState({ status: '', reason: '' });
  const [error, setError] = useState('');

  // Fetch user verification requests
  const fetchVerificationRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = getAuthHeaders();
      
      const params = new URLSearchParams();
      if (filterStatus !== 'all') {
        params.append('status', filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1));
      }
      
      const queryString = params.toString();
      const url = `${API_BASE_URL}/admin/verification-requests/${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setVerificationRequests(data.results || data);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      setError('Failed to fetch verification requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/verification-stats/`, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    fetchVerificationRequests();
    fetchUserStats();
  }, [filterStatus]);

  // Handle user verification action
  const handleVerificationAction = async (requestId, status, reason = '') => {
    setActionLoading(true);
    setError('');
    
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/verification-requests/${requestId}/update/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ status, reason })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setVerificationRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status, reason, reviewed_by: data.reviewed_by }
            : req
        )
      );
      
      setShowModal(false);
      setActionData({ status: '', reason: '' });
      setSelectedRequest(null);
      
      // Refresh stats
      fetchUserStats();
    } catch (error) {
      console.error('Error updating verification status:', error);
      setError(`Failed to update verification status: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Open action modal
  const openActionModal = (request, status) => {
    setSelectedRequest(request);
    setActionData({ status, reason: '' });
    setShowModal(true);
  };

  // Filter requests
  const filteredRequests = verificationRequests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = 
      req.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.user_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.user_phone?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'text-green-600 bg-green-50';
      case 'Rejected': return 'text-red-600 bg-red-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Verified': return <CheckCircle className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDocumentUrl = (documentPath) => {
    if (!documentPath) return null;
    if (documentPath.startsWith('http')) {
      return documentPath;
    }
    return `${API_BASE_URL.replace('/api', '')}${documentPath}`;
  };

  const openDocument = (documentPath) => {
    const url = getDocumentUrl(documentPath);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const downloadDocument = (documentPath, filename) => {
    const url = getDocumentUrl(documentPath);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className={themeClasses.text.secondary}>Loading verification requests...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Error Message */}
      {error && (
        <div className={`mb-6 p-4 rounded-lg border ${
          darkMode 
            ? 'bg-red-900/30 border-red-700 text-red-300' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className={`${themeClasses.card} overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300`}>
          <div className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className={`text-sm font-medium ${themeClasses.text.muted} truncate`}>Total Requests</dt>
                  <dd className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>{userStats.total_requests}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className={`${themeClasses.card} overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300`}>
          <div className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className={`text-sm font-medium ${themeClasses.text.muted} truncate`}>Pending</dt>
                  <dd className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>{userStats.pending_requests}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className={`${themeClasses.card} overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300`}>
          <div className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className={`text-sm font-medium ${themeClasses.text.muted} truncate`}>Verified</dt>
                  <dd className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>{userStats.verified_requests}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className={`${themeClasses.card} overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300`}>
          <div className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className={`text-sm font-medium ${themeClasses.text.muted} truncate`}>Rejected</dt>
                  <dd className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>{userStats.rejected_requests}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Verification Requests */}
      <div className="space-y-6">
        {filteredRequests.map((request) => (
          <div key={request.id} className={`${themeClasses.card} shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {request.user_profile_image ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={getDocumentUrl(request.user_profile_image)}
                        alt={request.user_username}
                      />
                    ) : (
                      <div className={`h-12 w-12 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>{request.user_username}</h3>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>{request.user_email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    <span className="ml-2">{request.status}</span>
                  </span>
                  <button
                    onClick={() => setExpandedCard(expandedCard === request.id ? null : request.id)}
                    className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                  >
                    {expandedCard === request.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className={`text-sm ${themeClasses.text.secondary}`}>{request.user_phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className={`text-sm ${themeClasses.text.secondary} capitalize`}>{request.user_role?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className={`text-sm ${themeClasses.text.secondary}`}>{formatDate(request.created_at)}</span>
                </div>
              </div>

              {expandedCard === request.id && (
                <div className={`mt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`text-sm font-medium ${themeClasses.text.primary} mb-3`}>User Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm ${themeClasses.text.secondary}`}>National ID: {request.user_national_id}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm ${themeClasses.text.secondary}`}>{request.user_email}</span>
                        </div>
                        {request.reviewed_by_username && (
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm ${themeClasses.text.secondary}`}>Reviewed by: {request.reviewed_by_username}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className={`text-sm font-medium ${themeClasses.text.primary} mb-3`}>Documents</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IdCard className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm ${themeClasses.text.secondary}`}>National ID Image</span>
                          </div>
                          {request.user_national_id_img ? (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => openDocument(request.user_national_id_img)}
                                className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} text-sm`}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => downloadDocument(request.user_national_id_img, 'national_id.jpg')}
                                className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'} text-sm`}
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-red-500 text-sm">Missing</span>
                          )}
                        </div>

                        {request.user_role === 'driver' && (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <IdCard className="w-4 h-4 text-gray-400" />
                                <span className={`text-sm ${themeClasses.text.secondary}`}>Driver License</span>
                              </div>
                              {request.user_driver_license ? (
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => openDocument(request.user_driver_license)}
                                    className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} text-sm`}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => downloadDocument(request.user_driver_license, 'driver_license.pdf')}
                                    className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'} text-sm`}
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-red-500 text-sm">Missing</span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Car className="w-4 h-4 text-gray-400" />
                                <span className={`text-sm ${themeClasses.text.secondary}`}>Car License</span>
                              </div>
                              {request.user_car_license ? (
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => openDocument(request.user_car_license)}
                                    className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} text-sm`}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => downloadDocument(request.user_car_license, 'car_license.pdf')}
                                    className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'} text-sm`}
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-red-500 text-sm">Missing</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {request.missing_documents && request.missing_documents.length > 0 && (
                    <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Missing Documents:</span>
                      </div>
                      <ul className={`mt-2 text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                        {request.missing_documents.map((doc, index) => (
                          <li key={index} className="ml-4">• {doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {request.reason && (
                    <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Reason/Notes:</span>
                      </div>
                      <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{request.reason}</p>
                    </div>
                  )}

                  {request.status === 'Pending' && (
                    <div className="mt-6 flex space-x-4">
                      <button
                        onClick={() => openActionModal(request, 'Verified')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => openActionModal(request, 'Rejected')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className={`mt-2 text-sm font-medium ${themeClasses.text.primary}`}>
            No verification requests
          </h3>
          <p className={`mt-1 text-sm ${themeClasses.text.secondary}`}>
            {searchTerm || filterStatus !== 'all' 
              ? 'No requests match your search criteria.'
              : 'No verification requests found.'}
          </p>
        </div>
      )}

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 transition-opacity duration-300">
          <div className={`relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-medium ${themeClasses.text.primary}`}>
                  {actionData.status === 'Verified' ? 'Approve' : 'Reject'} Verification
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className={`text-sm ${themeClasses.text.secondary}`}>
                  {actionData.status === 'Verified'
                    ? `Are you sure you want to approve ${selectedRequest?.user_username}'s verification?`
                    : `Are you sure you want to reject ${selectedRequest?.user_username}'s verification?`}
                </p>
              </div>

              {actionData.status === 'Rejected' && (
                <div className="mb-4">
                  <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                    Reason for rejection *
                  </label>
                  <textarea
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    rows="3"
                    value={actionData.reason}
                    onChange={(e) => setActionData({...actionData, reason: e.target.value})}
                    placeholder="Please provide a reason for rejection..."
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${darkMode ? 'text-gray-200 bg-gray-700 hover:bg-gray-600 focus:ring-gray-500 border-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 border-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerificationAction(selectedRequest.id, actionData.status, actionData.reason)}
                  disabled={actionLoading || (actionData.status === 'Rejected' && !actionData.reason.trim())}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    actionData.status === 'Verified'
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    actionData.status === 'Verified' ? 'Approve' : 'Reject'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserVerificationComponent;
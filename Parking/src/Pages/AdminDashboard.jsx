import React, { useState, useEffect } from 'react';
import {Users,CheckCircle,XCircle,Clock,FileText, Eye, Download, Search, Filter, Mail, User,Phone,CreditCard, Car,IdCard,ImageIcon,ChevronDown,ChevronUp,Loader2, AlertCircle,CheckCircle2
} from 'lucide-react';
import instance from '../apis/config';
import { useLanguage } from '../context/LanguageContext'; 

function AdminDashboard({ darkMode, setDarkMode }) {
  const { language, setLanguage } = useLanguage();

 
  const t = {
    en: {
      title: "Admin Dashboard",
      lastUpdated: "Last updated",
      totalRequests: "Total Requests",
      pendingRequests: "Pending Requests",
      verified: "Verified",
      rejected: "Rejected",
      verificationRate: "Verification Rate",
      searchPlaceholder: "Search by name or email...",
      filterLabel: "Filter by status",
      allStatus: "All Status",
      pending: "Pending",
      verified: "Verified",
      rejected: "Rejected",
      showRequests: "Showing {count} of {total} requests",
      expandDetails: "Show Details",
      hideDetails: "Hide Details",
      phone: "Phone",
      role: "Role",
      submitted: "Submitted",
      documents: "Documents",
      view: "View",
      download: "Download",
      missingDocuments: "Missing Documents",
      approve: "Approve",
      reject: "Reject",
      actionModalTitle: (status) => status === 'Verified' ? 'Approve Verification' : 'Reject Verification',
      reasonForRejection: "Reason for Rejection (optional)",
      cancel: "Cancel",
      confirm: (status) => status === 'Verified' ? 'Approve' : 'Reject',
      loading: "Loading dashboard...",
      errorFetch: "Failed to fetch verification requests. Please try again.",
      errorStats: "Failed to fetch statistics.",
      errorAction: (action) => `Failed to ${action.toLowerCase()} verification status`,
      successAction: (action) => `Request has been ${action.toLowerCase()} successfully.`,
      driverLicense: "Driver License",
      carLicense: "Car License",
      nationalIdImage: "National ID Image"
    },
    ar: {
      title: "لوحة تحكم المشرف",
      lastUpdated: "آخر تحديث",
      totalRequests: "إجمالي الطلبات",
      pendingRequests: "الطلبات المعلقة",
      verified: "تم التحقق",
      rejected: "مرفوض",
      verificationRate: "نسبة التحقق",
      searchPlaceholder: "ابحث بالاسم أو البريد الإلكتروني...",
      filterLabel: "تصفية حسب الحالة",
      allStatus: "جميع الحالات",
      pending: "معلق",
      verified: "متحقق",
      rejected: "مرفوض",
      showRequests: "عرض {count} من أصل {total} طلب",
      expandDetails: "عرض التفاصيل",
      hideDetails: "إخفاء التفاصيل",
      phone: "الهاتف",
      role: "الدور",
      submitted: "تم التقديم",
      documents: "الوثائق",
      view: "عرض",
      download: "تحميل",
      missingDocuments: "الوثائق المفقودة",
      approve: "موافقة",
      reject: "رفض",
      actionModalTitle: (status) => status === 'Verified' ? 'تأكيد التحقق' : 'رفض الطلب',
      reasonForRejection: "سبب الرفض (اختياري)",
      cancel: "إلغاء",
      confirm: (status) => status === 'Verified' ? 'تأكيد الموافقة' : 'تأكيد الرفض',
      loading: "جاري تحميل لوحة التحكم...",
      errorFetch: "فشل جلب طلبات التحقق. يرجى المحاولة مجددًا.",
      errorStats: "فشل جلب الإحصائيات.",
      errorAction: (action) => `فشل في ${action === 'Verified' ? 'الموافقة' : 'الرفض'}`,
      successAction: (action) => `تم ${action === 'Verified' ? 'الموافقة' : 'الرفض'} بنجاح.`
    }
  };

  const [verificationRequests, setVerificationRequests] = useState([]);
  const [stats, setStats] = useState({
    total_requests: 0,
    pending_requests: 0,
    verified_requests: 0,
    rejected_requests: 0,
    verification_rate: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionData, setActionData] = useState({ status: '', reason: '' });
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:8000/api';

  const getAuthHeaders = () => {
    const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
    const token = storedToken ? JSON.parse(storedToken).access : null;
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const themeClasses = {
    background: darkMode ? 'bg-gray-900' : 'bg-gray-50',
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

  const fetchVerificationRequests = async () => {
    try {
      const headers = getAuthHeaders();
      let url = `${API_BASE_URL}/admin/verification-requests/`;

      const params = new URLSearchParams();
      if (filterStatus !== 'all') {
        params.append('status', filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1));
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setVerificationRequests(data.results || data);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      setError(t[language].errorFetch);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/verification-stats/`, { headers });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(t[language].errorStats);
    }
  };

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
          req.id === requestId ? { ...req, status, reason, reviewed_by: data.reviewed_by } : req
        )
      );
      await fetchStats();
      setShowModal(false);
      setActionData({ status: '', reason: '' });
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating verification status:', error);
      setError(`${t[language].errorAction(status)}: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const openActionModal = (request, status) => {
    setSelectedRequest(request);
    setActionData({ status, reason: '' });
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDocumentUrl = (documentPath) => {
    if (!documentPath) return null;
    if (documentPath.startsWith('http')) return documentPath;
    return `${API_BASE_URL.replace('/api', '')}${documentPath}`;
  };

  const openDocument = (documentPath) => {
    const url = getDocumentUrl(documentPath);
    if (url) window.open(url, '_blank');
  };

  const downloadDocument = (documentPath, filename) => {
    const url = getDocumentUrl(documentPath);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.click();
    }
  };

  const filteredRequests = verificationRequests.filter(request => {
    const matchesSearch = request.user_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchVerificationRequests();
    fetchStats();
  }, [filterStatus, searchTerm]);

  if (loading) {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className={themeClasses.text.secondary}>{t[language].loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ease-in-out ${themeClasses.background}`}>
      {/* Header */}
      <div className={`${themeClasses.card} shadow-sm border-b`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2 sm:mr-3" />
              <h1 className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>{t[language].title}</h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className={`text-xs sm:text-sm ${themeClasses.text.secondary}`}>
                {t[language].lastUpdated}: {new Date().toLocaleTimeString()}
              </div>

              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className={`px-3 py-2 text-sm rounded-md transition-all duration-200 hover:scale-105 ${
                  darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                style={{ minWidth: '80px', textAlign: 'center' }}
              >
                {language === 'ar' ? 'EN' : 'AR'}
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-3 py-2 text-sm rounded-md transition-all duration-200 hover:scale-105 ${
                  darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`mx-4 my-2 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm ${darkMode ? 'bg-red-900/30 border-red-800 text-red-300' : ''}`}>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className={`${themeClasses.card} overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300`}>
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0"><Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" /></div>
                <div className="ml-4 sm:ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium ${themeClasses.text.muted} truncate`}>{t[language].totalRequests}</dt>
                    <dd className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>{stats.total_requests}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className={`${themeClasses.card} overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300`}>
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0"><Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" /></div>
                <div className="ml-4 sm:ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium ${themeClasses.text.muted} truncate`}>{t[language].pendingRequests}</dt>
                    <dd className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>{stats.pending_requests}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className={`${themeClasses.card} overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300`}>
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0"><CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" /></div>
                <div className="ml-4 sm:ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium ${themeClasses.text.muted} truncate`}>{t[language].verified}</dt>
                    <dd className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>{stats.verified_requests}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className={`${themeClasses.card} overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300`}>
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0"><XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" /></div>
                <div className="ml-4 sm:ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium ${themeClasses.text.muted} truncate`}>{t[language].rejected}</dt>
                    <dd className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>{stats.rejected_requests}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 ${themeClasses.text.muted}`} />
            <input
              type="text"
              placeholder={t[language].searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${themeClasses.input}`}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className={`text-sm ${themeClasses.text.muted}`}>{t[language].filterLabel}:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${themeClasses.input}`}
            >
              <option value="all">{t[language].allStatus}</option>
              <option value="pending">{t[language].pending}</option>
              <option value="verified">{t[language].verified}</option>
              <option value="rejected">{t[language].rejected}</option>
            </select>
          </div>
        </div>

        <div className={`text-sm ${themeClasses.text.secondary} mb-4`}>
          {t[language].showRequests.replace('{count}', filteredRequests.length).replace('{total}', verificationRequests.length)}
        </div>

        {/* Verification Requests */}
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
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className={`text-lg font-medium ${themeClasses.text.primary}`}>{request.user_username}</h3>
                      <p className={`text-sm ${themeClasses.text.secondary}`}>{request.user_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'Verified'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : request.status === 'Rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {t[language][request.status.toLowerCase()] || request.status}
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
                    <span className={`text-sm ${themeClasses.text.secondary} capitalize`}>
                      {request.user_role?.replace('_', ' ') || '-'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${themeClasses.text.secondary}`}>{formatDate(request.created_at)}</span>
                  </div>
                </div>

                {expandedCard === request.id && (
                  <div className={`mt-6 border-t ${darkMode ? 'border-gray-700 pt-4' : 'border-gray-200 pt-4'}`}>
                    <h4 className={`text-md font-medium ${themeClasses.text.primary} mb-3`}>{t[language].documents}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: t[language].driverLicense, path: request.driver_license },
                        { label: t[language].carLicense, path: request.car_license },
                        { label: t[language].nationalIdImage, path: request.national_id_img }
                      ].map((doc, index) => (
                        doc.path ? (
                          <div key={index} className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className={`text-sm ${themeClasses.text.secondary}`}>{doc.label}</span>
                            <button
                              onClick={() => openDocument(doc.path)}
                              className="text-blue-600 hover:text-blue-800 text-xs underline"
                            >
                              {t[language].view}
                            </button>
                            <button
                              onClick={() => downloadDocument(doc.path, `${doc.label}.pdf`)}
                              className="text-blue-600 hover:text-blue-800 text-xs underline ml-1"
                            >
                              {t[language].download}
                            </button>
                          </div>
                        ) : (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-500">{doc.label} — {t[language].notUploaded}</span>
                          </div>
                        )
                      ))}
                    </div>

                    {request.missing_documents && request.missing_documents.length > 0 && (
                      <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-800'}`}>{t[language].missingDocuments}:</span>
                        </div>
                        <ul className={`mt-2 text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                          {request.missing_documents.map((doc, index) => (
                            <li key={index}>• {doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-6 flex space-x-4">
                      <button
                        onClick={() => openActionModal(request, 'Verified')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />{t[language].approve}
                      </button>
                      <button
                        onClick={() => openActionModal(request, 'Rejected')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-2" />{t[language].reject}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${themeClasses.card}`}>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-medium ${themeClasses.text.primary}`}>
                    {t[language].actionModalTitle(actionData.status)}
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
                      ? 'Are you sure you want to approve this verification request?'
                      : t[language].reasonForRejection}
                  </p>
                  {actionData.status === 'Rejected' && (
                    <textarea
                      value={actionData.reason}
                      onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
                      className={`mt-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${themeClasses.input}`}
                      rows="3"
                      placeholder="Enter reason for rejection..."
                    ></textarea>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.button.secondary}`}
                  >
                    {t[language].cancel}
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
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t[language].confirm(actionData.status)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
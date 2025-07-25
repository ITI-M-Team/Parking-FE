import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Plus, Edit, QrCode, Loader, AlertCircle, Send, Clock, ZapOff, Calendar, DollarSign, ParkingSquare, Car, ArrowLeft, ArrowRight, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import ownerDashboardApi from '../apis/ownerDashboardApi';
import TodaysBookingsTable from './OwnerDashboard/TodaysBookingsTable';
import ParkingSpotList from './OwnerDashboard/ParkingSpotList';

// --- دوال وكومبوننتات مساعدة ---

const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

// --- كومبوننت عرض حالة التحقق ---
const VerificationStatusBanner = ({ garage, darkMode }) => {

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Verified':
        return {
          bgColor: darkMode ? 'bg-green-800/20 border-green-600/30' : 'bg-green-50 border-green-200',
          textColor: darkMode ? 'text-green-400' : 'text-green-800',
          icon: <CheckCircle className="w-5 h-5" />,
          title: 'Garage Verified',
          message: 'Your garage is verified and ready to accept bookings.',
          actionColor: 'text-green-600'
        };
      case 'Pending':
        return {
          bgColor: darkMode ? 'bg-yellow-800/20 border-yellow-600/30' : 'bg-yellow-50 border-yellow-200',
          textColor: darkMode ? 'text-yellow-400' : 'text-yellow-800',
          icon: <Clock className="w-5 h-5" />,
          title: 'Verification Pending',
          message: 'Your garage is currently under review. This process usually takes 2-3 business days.',
          actionColor: 'text-yellow-600'
        };
      case 'Rejected':
        return {
          bgColor: darkMode ? 'bg-red-800/20 border-red-600/30' : 'bg-red-50 border-red-200',
          textColor: darkMode ? 'text-red-400' : 'text-red-800',
          icon: <XCircle className="w-5 h-5" />,
          title: 'Verification Rejected',
          message: 'Your garage verification was rejected. Please review the feedback and resubmit.',
          actionColor: 'text-red-600'
        };
      default:
        return {
          bgColor: darkMode ? 'bg-gray-800/20 border-gray-600/30' : 'bg-gray-50 border-gray-200',
          textColor: darkMode ? 'text-gray-400' : 'text-gray-800',
          icon: <AlertTriangle className="w-5 h-5" />,
          title: 'Unknown Status',
          message: 'Verification status unknown. Please contact support.',
          actionColor: 'text-gray-600'
        };
    }
  };

  const config = getStatusConfig(garage.verification_status);
  const navigate = useNavigate();

  return (
    <div className={`p-4 rounded-lg border-2 mb-6 ${config.bgColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`${config.textColor} mt-0.5`}>
            {config.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold text-lg ${config.textColor}`}>
                {config.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.textColor}`}>
                {garage.verification_status}
              </span>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              {config.message}
            </p>
            <div className="text-xs text-gray-500">
              <strong>Garage:</strong> {garage.name}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {garage.verification_status === 'Rejected' && (
            <button
              onClick={() => navigate(`/garage/edit/${garage.id}`)}
              className={`px-3 py-1 text-sm font-medium rounded-md border transition-colors ${
                darkMode 
                  ? 'border-red-600 text-red-400 hover:bg-red-600/10' 
                  : 'border-red-600 text-red-600 hover:bg-red-50'
              }`}
            >
              Edit & Resubmit
            </button>
          )}
          
          <button
            onClick={() => navigate(`/garage/verification-status/${garage.id}`)}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, darkMode, subtext, subtextColor }) => (
  <div className={`p-6 rounded-lg shadow-md flex flex-col ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {icon}
    </div>
    <div className="mt-auto">
      <p className="text-3xl font-bold">{value}</p>
      {subtext && (
        <p className={`text-sm mt-1 font-semibold ${subtextColor || (darkMode ? 'text-gray-400' : 'text-gray-600')}`}>
          {subtext}
        </p>
      )}
    </div>
  </div>
);

const PaginationControls = ({ currentPage, totalPages, onNext, onPrev, darkMode, firstItem, lastItem, totalItems }) => (
  <div className={`flex flex-col sm:flex-row justify-between items-center pt-4 mt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      Showing <span className="font-medium">{firstItem}</span> to <span className="font-medium">{lastItem}</span> of <span className="font-medium">{totalItems}</span> spots
    </p>
    <div className="flex items-center gap-3 mt-3 sm:mt-0">
      <button onClick={onPrev} disabled={currentPage === 1} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500' : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'} disabled:cursor-not-allowed`}>
        <ArrowLeft className="w-4 h-4" /> Previous
      </button>
      <span className="text-sm font-semibold">{currentPage} / {totalPages}</span>
      <button onClick={onNext} disabled={currentPage === totalPages} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500' : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'} disabled:cursor-not-allowed`}>
        Next <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// --- كومبوننت ملخص حالة الحجوزات ---
const StatusSummary = ({ spots }) => {
  const availableCount = spots.filter(spot => spot.status === 'available').length;
  const occupiedCount = spots.filter(spot => spot.status === 'occupied').length;
  const reservedCount = spots.filter(spot => spot.status === 'reserved').length;

  return (
    <div className="flex items-center space-x-4 mb-4 text-sm font-medium">
      <span className="flex items-center">
        <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Available ({availableCount})
      </span>
      <span className="flex items-center">
        <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Occupied ({occupiedCount})
      </span>
      <span className="flex items-center">
        <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span> Reserved ({reservedCount})
      </span>
    </div>
  );
};

function OwnerDashboard({ darkMode }) {
  const [allGarages, setAllGarages] = useState([]);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const SPOTS_PER_PAGE = 20;

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerDashboardApi.getDashboardData();
      if (data && data.length > 0) {
        setAllGarages(data);
        const currentGarageId = selectedGarage?.id;
        const newSelected = data.find(g => g.id === currentGarageId) || data[0];
        setSelectedGarage(newSelected);
      } else {
        setError('No garages found. Please add a new garage to get started.');
        setAllGarages([]);
        setSelectedGarage(null);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to load dashboard data.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGarage]);

  const handleGarageChange = (garage) => {
    setSelectedGarage(garage);
  };

  const handleSendReport = async () => {
    if (!selectedGarage?.id) {
      alert('Error: Please select a garage first.');
      return;
    }
    const emailToSend = reportEmail.trim();
    if (!emailToSend) {
      alert('Error: Please enter an email address for the report.');
      return;
    }
    try {
      const result = await ownerDashboardApi.sendWeeklyReport(selectedGarage.id, emailToSend);
      alert(result.message || 'Report sent successfully!');
      setReportEmail('');
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred while sending the report.');
      console.error('Failed to send report:', error);
    }
  };

  const totalSpots = selectedGarage?.spots?.length || 0;
  const totalPages = Math.ceil(totalSpots / SPOTS_PER_PAGE);
  const indexOfLastSpot = currentPage * SPOTS_PER_PAGE;
  const indexOfFirstSpot = indexOfLastSpot - SPOTS_PER_PAGE;
  const currentSpots = selectedGarage?.spots?.slice(indexOfFirstSpot, indexOfLastSpot) || [];

  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (loading) {
    return <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : ''}`}><Loader className="w-12 h-12 animate-spin text-blue-500" /></div>;
  }

  if (error && allGarages.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center text-center p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h2 className="text-xl font-semibold mb-4">{error}</h2>
        <button onClick={() => navigate('/garage/register')} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700">
          <Plus className="w-5 h-5" /> Add Your First Garage
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-inter ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full max-w-7xl mx-auto px-4 py-4">
        {selectedGarage && (
          <>
            <VerificationStatusBanner garage={selectedGarage} darkMode={darkMode} />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <Listbox value={selectedGarage} onChange={handleGarageChange}>
                  <div className="relative w-64">
                    <Listbox.Button className={`relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <span className="block truncate text-lg font-semibold">{selectedGarage.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><ChevronUpDownIcon className="h-5 w 5 text-gray-400" aria-hidden="true" /></span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        {allGarages.map((garage) => (
                          <Listbox.Option key={garage.id} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-500 text-white' : (darkMode ? 'text-gray-200' : 'text-gray-900')}`} value={garage}>
                            {({ selected }) => (<><span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{garage.name}</span>{selected ? (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white"><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}</>)}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${selectedGarage.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {selectedGarage.is_open ? <Clock className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                  <span>{selectedGarage.is_open ? 'Open' : 'Closed'}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => navigate('/garage/register')} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"><Plus className="w-4 h-4" /> Add Garage</button>
                <button onClick={() => navigate(`/garage/edit/${selectedGarage.id}`)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium"><Edit className="w-4 h-4" /> Edit</button>
                <button onClick={() => navigate('/scanner')} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"><QrCode className="w-4 h-4" /> Scan</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
              <StatCard title="Daily Revenue" value={`$${selectedGarage.today_revenue ? selectedGarage.today_revenue.toFixed(2) : '0.00'}`} icon={<DollarSign className="w-6 h-6 text-green-500" />} darkMode={darkMode} />
              <StatCard title="Available Spots" value={`${selectedGarage.available_spots_count} / ${totalSpots}`} icon={<ParkingSquare className="w-6 h-6 text-blue-500" />} darkMode={darkMode} />
              <StatCard title="Occupied Spots" value={`${selectedGarage.occupied_spots_count} / ${totalSpots}`} icon={<Car className="w-6 h-6 text-red-500" />} darkMode={darkMode} />
              <StatCard title="Working Hours" value={`${formatTime(selectedGarage.opening_hour)} - ${formatTime(selectedGarage.closing_hour)}`} icon={<Calendar className="w-6 h-6 text-purple-500" />} darkMode={darkMode} subtext={selectedGarage.is_open ? 'Status: Open Now' : 'Status: Closed Now'} subtextColor={selectedGarage.is_open ? 'text-green-500' : 'text-red-500'} />
            </div>

            <div className="grid grid-cols-1 gap-6 my-6">
              <TodaysBookingsTable darkMode={darkMode} bookings={selectedGarage.today_bookings} />
            </div>

            <div className={`p-4 rounded-lg shadow-md mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold mb-3">Send Weekly Report</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="email" value={reportEmail} onChange={(e) => setReportEmail(e.target.value)} placeholder="Enter email for report" className={`flex-grow px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-600'}`} />
                <button onClick={handleSendReport} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium"><Send className="w-4 h-4" /> Send Report</button>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h3 className="text-lg font-semibold mb-2">Parking Spots Overview</h3>
              <StatusSummary spots={selectedGarage.spots} />
              <div className={`my-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
              <ParkingSpotList darkMode={darkMode} spots={currentSpots} />
              {totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onNext={handleNextPage}
                  onPrev={handlePrevPage}
                  darkMode={darkMode}
                  firstItem={indexOfFirstSpot + 1}
                  lastItem={Math.min(indexOfLastSpot, totalSpots)}
                  totalItems={totalSpots}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
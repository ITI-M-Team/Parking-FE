import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';

const CurrentBooking = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [exitData, setExitData] = useState(null);
  const [showExitPopup, setShowExitPopup] = useState(false);

  
  const getAuthTokens = () => sessionStorage.getItem("authTokens") || localStorage.getItem("authTokens");
  const getAccessToken = () => {
    const tokens = getAuthTokens();
    if (!tokens) return null;
    try {
      return JSON.parse(tokens).access;
    } catch {
      return null;
    }
  };
  const getRefreshToken = () => {
    const tokens = getAuthTokens();
    if (!tokens) return null;
    try {
      return JSON.parse(tokens).refresh;
    } catch {
      return null;
    }
  };
  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;
    try {
      const res = await axios.post("http://localhost:8000/api/token/refresh/", {
        refresh: refreshToken,
      });
      const newTokens = {
        ...JSON.parse(getAuthTokens()),
        access: res.data.access,
      };
      sessionStorage.getItem("authTokens")
        ? sessionStorage.setItem("authTokens", JSON.stringify(newTokens))
        : localStorage.setItem("authTokens", JSON.stringify(newTokens));
      return res.data.access;
    } catch {
      sessionStorage.removeItem("authTokens");
      localStorage.removeItem("authTokens");
      return null;
    }
  };

 
  const makeAuthenticatedRequest = async (config) => {
    let accessToken = getAccessToken();
    if (!accessToken) throw new Error("Please login first");
    try {
      return await axios({
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      if (err.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("Session expired. Please login again.");
        return await axios({
          ...config,
          headers: { ...config.headers, Authorization: `Bearer ${newToken}` },
        });
      } else throw err;
    }
  };

  
  const cancelBookingDueToExpiry = async () => {
    if (!booking) return;
    try {
      await makeAuthenticatedRequest({
        method: 'POST',
        url: `http://localhost:8000/api/bookings/cancel/${booking.id}/`,
      });
      setBooking(null);
    } catch (err) {
      console.error("Failed to auto-cancel expired booking:", err);
      setBooking(null);
    }
  };

  
  const fetchActiveBooking = async () => {
    try {
      setLoading(true);
      const res = await makeAuthenticatedRequest({
        method: 'GET',
        url: 'http://localhost:8000/api/bookings/active/',
      });

      if (res.data.status === 'completed') {
        setExitData(res.data);
        setShowExitPopup(true);
      } else if (
        res.data.status === 'confirmed' ||
        res.data.status === 'pending'
      ) {
        setBooking(res.data);
      } else {
        setBooking(null);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No active bookings found");
      } else {
        setError("Failed to load booking: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  
  const cancelBooking = async () => {
    if (!booking || !window.confirm("Are you sure you want to cancel the booking?")) return;
    try {
      setCancelLoading(true);
      await makeAuthenticatedRequest({
        method: 'POST',
        url: `http://localhost:8000/api/bookings/cancel/${booking.id}/`,
      });
      alert("Booking cancelled successfully");
      setBooking(null);
      setExitData(null);
      setShowExitPopup(false);
      fetchActiveBooking();
    } catch (err) {
      alert("Failed to cancel: " + err.message);
    } finally {
      setCancelLoading(false);
    }
  };

  
  const calculateTimeLeft = () => {
    if (!booking) return null;
    const now = new Date();
    const expiry = new Date(booking.reservation_expiry_time);
    const diff = expiry - now;

    if (diff <= 0) {
      cancelBookingDueToExpiry();
      return "Expired";
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    token ? fetchActiveBooking() : (setError("Please login first"), setLoading(false));
  }, []);

  useEffect(() => {
    if (booking) {
      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        setTimeLeft(newTimeLeft);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [booking]);

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hr ${mins} min`;
  };

  const calculateTotalCost = (start_time, end_time, price_per_hour) => {
    if (!start_time || !end_time || !price_per_hour) return 0;
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);
    const durationInMinutes = (endTime - startTime) / 60000;
    const totalCost = (durationInMinutes / 60) * price_per_hour;
    return totalCost.toFixed(2);
  };

  const baseClass = darkMode ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className={`p-4 max-w-md mx-auto ${baseClass}`}>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-300"
          role="alert"
        >
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );

  if (!booking)
    return (
      <div className={`min-h-screen p-4 ${baseClass}`}>
        <div className={`${cardBg} shadow-sm px-4 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Booking Details</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded text-sm bg-gray-200 dark:bg-gray-700 dark:text-white"
          >
            {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">No active bookings found</p>
            <button
              onClick={fetchActiveBooking}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Refresh
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen p-4 ${baseClass}`}>
      <div className={`${cardBg} shadow-sm px-4 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Booking Details</h1>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded text-sm bg-gray-200 dark:bg-gray-700 dark:text-white"
        >
          {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${cardBg} p-6 rounded-xl shadow-md`}>
          <h2 className="text-lg font-bold mb-4">Booking Info</h2>
          <div className="space-y-3">
            <p><strong>Garage:</strong> {booking.garage_name}</p>
            <p><strong>Spot:</strong> #{booking.parking_spot}</p>
            <p><strong>Estimated Cost:</strong> {booking.estimated_cost} EGP</p>
            <p><strong>Price/Hour:</strong> {booking.price_per_hour} EGP</p>
            <p><strong>Status:</strong> {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}</p>
            <p><strong>Expiry Time:</strong> {formatTime(booking.reservation_expiry_time)}</p>
           
            <p>
              <strong>⏳ Time left before expiry:</strong>{' '}
              <span
                className={`text-lg font-bold ${
                  timeLeft && timeLeft.includes('s') && !timeLeft.includes('m') && !timeLeft.includes('h')
                    ? 'text-red-500 animate-pulse'
                    : timeLeft && timeLeft.includes('m') && !timeLeft.includes('h')
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}
              >
                {timeLeft || 'Calculating...'}
              </span>
            </p>
            
            {timeLeft && timeLeft.includes('s') && !timeLeft.includes('m') && !timeLeft.includes('h') && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ Hurry up! Your reservation will expire very soon.
              </p>
            )}
            {timeLeft && timeLeft.includes('m') && !timeLeft.includes('h') && parseInt(timeLeft) <= 5 && (
              <p className="text-sm text-yellow-600 mt-2">
                ⚠️ Your reservation will expire in a few minutes.
              </p>
            )}
          </div>
          {booking.status === 'pending' && (
            <button
              onClick={cancelBooking}
              disabled={cancelLoading}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" /> {cancelLoading ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          )}
        </div>

        <div className={`${cardBg} p-6 rounded-xl shadow-md text-center`}>
          <h2 className="text-lg font-bold mb-4">QR Code</h2>
          <div className="inline-block p-4 border-2 border-dashed border-gray-400 rounded-lg">
            <img
              src={`http://localhost:8000${booking.qr_code_image}`}
              alt="QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Scan this code at the garage</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={fetchActiveBooking}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold inline-flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Refresh
        </button>
      </div>

      
      {showExitPopup && exitData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-center">🚗 Visit Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="font-semibold">Garage:</span><span>{exitData.garage_name}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Spot:</span><span>#{booking.parking_spot}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Entry Time:</span><span>{formatTime(exitData.start_time)}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Exit Time:</span><span>{formatTime(exitData.end_time)}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Total Duration:</span><span>{formatDuration(exitData.total_duration_minutes)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Cost:</span>
                <span className="text-green-600">{calculateTotalCost(exitData.start_time, exitData.end_time, booking.price_per_hour)} EGP</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setShowExitPopup(false);
                  setExitData(null);
                  window.location.reload();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentBooking;
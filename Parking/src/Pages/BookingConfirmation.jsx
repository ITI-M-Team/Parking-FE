import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BookingConfirmation = ({ darkMode }) => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
        const token = storedToken ? JSON.parse(storedToken).access : null;

        if (!token) {
          setError("❌ Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:8000/api/bookings/${bookingId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          setError("❌ Unauthorized. Please log in again.");
        } else if (res.status === 404) {
          setError("❌ Booking not found.");
        } else if (!res.ok) {
          setError("❌ Failed to fetch booking data.");
        } else {
          const data = await res.json();
          setBooking(data);

          if (data.reservation_expiry_time) {
            const expiryTime = new Date(data.reservation_expiry_time).getTime();
            const now = new Date().getTime();
            setTimeLeft(Math.max(0, expiryTime - now));
          }
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("❌ An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    if (timeLeft === null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          alert("❗️Your reservation has expired!");
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const formatDateTime = (iso) => {
    const date = new Date(iso);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <p className="text-lg font-medium">Loading booking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 py-10 flex justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`w-full max-w-xl p-6 rounded-lg shadow-lg border transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h1 className="text-2xl font-bold mb-4 text-[#CF0018]">Booking Confirmation</h1>

        <div className="space-y-2 text-base">
          <p><strong>Garage:</strong> {booking.garage_name || 'N/A'}</p>
          <p><strong>Spot ID:</strong> {booking.spot_id || 'N/A'}</p>
          <p><strong>Status:</strong> {booking.status || 'N/A'}</p>
          <p><strong>Estimated Arrival:</strong> {formatDateTime(booking.estimated_arrival_time)}</p>
          <p><strong>Reservation Expires:</strong> {formatDateTime(booking.reservation_expiry_time)}</p>
        </div>

        {timeLeft !== null && (
          <div className="mt-6">
            <p className="text-lg font-semibold">⏳ Time left to confirm:</p>
            <div className="text-3xl font-bold text-red-500 mt-2">
              {formatTime(timeLeft)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation;

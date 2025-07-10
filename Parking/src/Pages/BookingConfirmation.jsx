import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BookingConfirmation = ({ darkMode }) => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token =
          JSON.parse(localStorage.getItem("authTokens"))?.access ||
          JSON.parse(sessionStorage.getItem("authTokens"))?.access;

        const res = await fetch(`http://localhost:8000/api/bookings/${bookingId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setBooking(data);

        if (data.reservation_expiry_time) {
          const expiryTime = new Date(data.reservation_expiry_time).getTime();
          const now = new Date().getTime();
          setTimeLeft(Math.max(0, expiryTime - now));
        }
      } catch (err) {
        console.error("Failed to fetch booking:", err);
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
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDateTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString();
  };

  if (!booking) {
    return (
      <div className="text-center mt-10 text-lg font-medium text-gray-500">
        Loading booking...
      </div>
    );
  }

  return (
    <div
      className={`max-w-xl mx-auto mt-10 p-6 border shadow rounded-lg transition-all duration-300 ${
        darkMode
          ? 'bg-gray-900 text-white border-gray-700'
          : 'bg-white text-gray-900 border-gray-200'
      }`}
    >
      <h1 className="text-2xl font-bold mb-4 text-[#CF0018]">Booking Confirmation</h1>

      <p><strong>Garage:</strong> {booking.garage_name}</p>
      <p><strong>Spot ID:</strong> {booking.spot_id}</p>
      <p><strong>Status:</strong> {booking.status}</p>
      <p><strong>Estimated Arrival:</strong> {formatDateTime(booking.estimated_arrival_time)}</p>
      <p><strong>Reservation Expires:</strong> {formatDateTime(booking.reservation_expiry_time)}</p>

      {timeLeft !== null && (
        <div className="mt-6">
          <p className="text-lg font-semibold">⏳ Time left to confirm:</p>
          <div className="text-3xl font-bold text-red-500 mt-2">
            {formatTime(timeLeft)}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingConfirmation;

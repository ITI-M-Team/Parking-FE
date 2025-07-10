import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authTokens"))?.access;
        if (!token) {
          setError("You are not authenticated.");
          return;
        }

        const res = await fetch(`http://localhost:8000/api/bookings/${bookingId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType?.includes("application/json")) {
          const errorText = await res.text();
          throw new Error(errorText || "Booking not found");
        }

        const data = await res.json();
        setBooking(data);

        if (data.reservation_expiry_time) {
          const expiryTime = new Date(data.reservation_expiry_time).getTime();
          const now = new Date().getTime();
          setTimeLeft(Math.max(0, expiryTime - now));
        }
      } catch (err) {
        console.error("Failed to fetch booking:", err);
        setError("⚠️ Could not load booking details.");
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
    if (!iso) return "N/A";
    const date = new Date(iso);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-red-100 border border-red-300 text-red-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!booking) {
    return <div className="text-center mt-10">Loading booking...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white border border-gray-200 shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-[#CF0018]">Booking Confirmation</h1>

      <p><strong>Garage:</strong> {booking.garage_name || "N/A"}</p>
      <p><strong>Spot ID:</strong> {booking.spot_id || "N/A"}</p>
      <p><strong>Status:</strong> {booking.status || "N/A"}</p>
      <p><strong>Estimated Arrival:</strong> {formatDateTime(booking.estimated_arrival_time)}</p>
      <p><strong>Reservation Expires:</strong> {formatDateTime(booking.reservation_expiry_time)}</p>

      <p className="mt-2 text-green-700 font-medium">
        💰 Wallet Balance After Booking: <strong>{booking.wallet_balance} EGP</strong>
      </p>

      {booking.qr_code_image && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Scan this QR code at the entrance:</p>
          <img
            src={booking.qr_code_image}
            alt="Booking QR Code"
            className="mx-auto w-48 h-48 object-contain border rounded"
          />
        </div>
      )}

      {timeLeft !== null && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-gray-700">⏳ Time left before expiry:</p>

          <div className={`text-3xl font-bold mt-2 ${
            timeLeft <= 5 * 60 * 1000 ? 'text-yellow-500 animate-pulse' : 'text-red-500'
          }`}>
            {formatTime(timeLeft)}
          </div>

          {timeLeft <= 5 * 60 * 1000 && (
            <p className="text-sm text-yellow-600 mt-2">
              ⚠️ Hurry up! Your reservation will expire soon.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingConfirmation;

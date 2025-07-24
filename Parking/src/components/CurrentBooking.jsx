import React, { useState, useEffect } from "react";
import axios from "axios";
import { RotateCcw, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const CurrentBooking = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [timeText, setTimeText] = useState("");
  const [confirmingLate, setConfirmingLate] = useState(false);
  const [cancellingLate, setCancellingLate] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [exitData, setExitData] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const getAuthTokens = () =>
    sessionStorage.getItem("authTokens") || localStorage.getItem("authTokens");

  const getAccessToken = () => {
    const tokens = getAuthTokens();
    if (!tokens) return null;
    try {
      return JSON.parse(tokens).access;
    } catch {
      return null;
    }
  };

  const refreshAccessToken = async () => {
    const tokens = getAuthTokens();
    if (!tokens) return null;
    try {
      const res = await axios.post("http://localhost:8000/api/token/refresh/", {
        refresh: JSON.parse(tokens).refresh,
      });
      const newTokens = { ...JSON.parse(tokens), access: res.data.access };
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
    let token = getAccessToken();
    if (!token) throw new Error("Please login first");
    try {
      return await axios({
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${token}` },
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

  const fetchActiveBooking = async () => {
    try {
      setLoading(true);
      const res = await makeAuthenticatedRequest({
        method: "GET",
        url: "http://localhost:8000/api/bookings/active/",
      });
      setBooking(res.data);
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
    if (!booking || !window.confirm("Cancel booking?")) return;
    try {
      setCancelLoading(true);
      await makeAuthenticatedRequest({
        method: "POST",
        url: `http://localhost:8000/api/bookings/cancel/${booking.id}/`,
      });
      toast.success("Booking cancelled.");
      setBooking(null);
      fetchActiveBooking();
    } catch (err) {
      toast.error("Failed: " + (err.response?.data?.error || err.message));
      console.error("Error response:", err.response?.data);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleConfirmLate = async () => {
    if (!booking) return;
    setConfirmingLate(true);
    try {
      await makeAuthenticatedRequest({
        method: "POST",
        url: `http://localhost:8000/api/bookings/${booking.id}/late-decision/`,
        data: { action: "confirm" },
      });
      toast.success("Booking confirmed.");
      fetchActiveBooking();
    } catch (err) {
      toast.error("Failed: " + (err.response?.data?.error || err.message));
    } finally {
      setConfirmingLate(false);
    }
  };

  const handleCancelLate = async () => {
    if (!booking || !window.confirm("Cancel this booking?")) return;
    setCancellingLate(true);
    try {
      await makeAuthenticatedRequest({
        method: "POST",
        url: `http://localhost:8000/api/bookings/${booking.id}/late-decision/`,
        data: { action: "cancel" },
      });
      toast.success("Booking cancelled.");
      fetchActiveBooking();
    } catch (err) {
      toast.error("Failed: " + (err.response?.data?.error || err.message));
    } finally {
      setCancellingLate(false);
    }
  };

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const updateTimer = () => {
    if (!booking) return setTimeText("");
    const now = new Date();
    let start;
    let label;

    if (booking.confirmation_time && !booking.start_time) {
      start = new Date(booking.confirmation_time);
      label = "Time since confirm:";
      const diff = Math.floor((now - start) / 1000);
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      return setTimeText(`${label} ${mins}m ${secs}s`);
    } else if (booking.start_time) {
      start = new Date(booking.start_time);
      label = "Garage time:";
      const confirm = new Date(booking.confirmation_time);
      const diff = Math.floor((start - confirm) / 1000);
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      return setTimeText(`${label} ${mins}m ${secs}s`);
    } else {
      const expiry = new Date(booking.reservation_expiry_time);
      const diff = expiry - now;
      if (diff <= 0) return setTimeText("Expired");
      const mins = Math.floor(diff / 1000 / 60);
      const secs = Math.floor((diff / 1000) % 60);
      return setTimeText(`Time left: ${mins}m ${secs}s`);
    }
  };

  const handleRating = async (star) => {
    setRating(star);
  };

  const handleRescan = async () => {
    if (!exitData) return;
    try {
      await makeAuthenticatedRequest({
        method: "POST",
        url: `http://localhost:8000/api/garages/${exitData.garage_id}/review/${exitData.booking_id}/`,
        data: {
          rating,
          comment,
        },
      });
      toast.success("Thank you for your review!");
      setShowExitPopup(false);
      setRating(0);
      setComment("");
      setTimeout(() => {
        navigate("/nearby-garages");
      }, 1000);
    } catch (err) {
      toast.error("Failed to submit review.");
      console.error(err.response?.data || err.message);
    }
  };

  const closeExitPopup = () => {
    const navigate = useNavigate();
    setShowExitPopup(false);
    setRating(0);
    setComment("");
    setExitData(null);
    setTimeout(() => {
      navigate("/nearby-garages");
    }, 300);
  };

  useEffect(() => {
    const token = getAccessToken();
    token ? fetchActiveBooking() : (setError("Please login first"), setLoading(false));
  }, []);

  useEffect(() => {
    if (
      booking?.status === "completed" &&
      !showExitPopup &&
      booking.start_time &&
      booking.end_time
    ) {
      setExitData({
        booking_id: booking.id,
        garage_id: booking.garage_id,
        garage_name: booking.garage_name,
        spot_id: booking.parking_spot,
        start_time: booking.start_time,
        end_time: booking.end_time,
        total_duration_minutes: booking.total_duration_minutes,
        actual_cost: booking.actual_cost,
        wallet_balance: booking.wallet_balance,
      });
      setShowExitPopup(true);
    }
  }, [booking]);

  useEffect(() => {
    if (!timerActive || (booking && booking.start_time)) return;

    const interval = setInterval(() => {
      updateTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [booking]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 max-w-md mx-auto dark:bg-gray-900 dark:text-white">
        <div className="bg-red-100 dark:bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
      <div className="min-h-screen p-4 dark:bg-gray-900 dark:text-white">
        <div className="text-center mt-20">
          <p>No active bookings</p>
          <button
            onClick={fetchActiveBooking}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mt-4"
          >
            <RotateCcw className="inline-block w-5 h-5 mr-2" /> Refresh
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 font-sans text-gray-900 dark:text-white">
     
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div
          className="bg-blue-50 p-10 rounded-3xl shadow-xl flex flex-col gap-4"
          style={{ fontFamily: "Poppins, Arial, sans-serif" }}
        >
          <h2 className="text-2xl font-bold mb-5 text-blue-900">Booking Info</h2>
          <p className="text-blue-900 text-lg">
            <span className="font-semibold">Garage:</span> {booking.garage_name}
          </p>
          <p className="text-blue-900 text-lg">
            <span className="font-semibold">Spot:</span> #{booking.parking_spot}
          </p>
          <p className="text-blue-900 text-lg">
            <span className="font-semibold">Estimated Cost:</span> {booking.estimated_cost} EGP
          </p>
          <p className="text-blue-900 text-lg">
            <span className="font-semibold">Status:</span> {booking.status}
          </p>
          <p className="text-blue-900 text-lg">
            <span className="font-semibold">Expiry:</span> {formatTime(booking.reservation_expiry_time)}
          </p>
          <p className="text-blue-900 text-lg">
            <span className="font-semibold">Timer:</span> {timeText || "Calculating..."}
          </p>

          {booking.status === "pending" && (
            <button
              onClick={cancelBooking}
              disabled={cancelLoading}
              className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl flex items-center justify-center gap-3 text-xl font-semibold transition"
              style={{ fontFamily: "Poppins, Arial, sans-serif" }}
            >
              <Trash2 className="w-6 h-6" />
              {cancelLoading ? "Cancelling..." : "Cancel"}
            </button>
          )}
        </div>

        <div
          className="bg-blue-50 p-10 rounded-3xl shadow-xl text-center flex flex-col items-center"
          style={{ fontFamily: "Poppins, Arial, sans-serif" }}
        >
          <h2 className="text-2xl font-bold mb-5 text-blue-900">QR Code</h2>
          <img
            src={`http://localhost:8000${booking.qr_code_image}`}
            alt="QR"
            className="w-64 h-64 mx-auto rounded-xl border-4 border-blue-100 bg-white"
          />
          <p className="mt-4 text-blue-800 text-lg">Scan at the garage</p>
          <button
            onClick={fetchActiveBooking}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-xl font-semibold transition"
            style={{ fontFamily: "Poppins, Arial, sans-serif" }}
          >
            <RotateCcw className="w-7 h-7" /> Refresh
          </button>
        </div>
      </div>

      {booking.status === "awaiting_response" && booking.late_alert_sent && (
        <div
          className="bg-yellow-50 p-8 rounded-2xl shadow-xl mt-10 max-w-2xl mx-auto text-center"
          style={{ fontFamily: "Poppins, Arial, sans-serif" }}
        >
          <p className="text-yellow-900 text-xl">Reservation expired. Confirm or cancel now.</p>
          <div className="flex gap-6 justify-center mt-6">
            <button
              onClick={handleConfirmLate}
              disabled={confirmingLate}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl text-xl font-semibold transition"
            >
              {confirmingLate ? "Confirming..." : "✅ Confirm"}
            </button>
            <button
              onClick={handleCancelLate}
              disabled={cancellingLate}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl text-xl font-semibold transition"
            >
              {cancellingLate ? "Cancelling..." : "❌ Cancel"}
            </button>
          </div>
        </div>
      )}

      {showExitPopup && exitData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-10 rounded-3xl max-w-md w-full mx-4 shadow-2xl"
            style={{ fontFamily: "Poppins, Arial, sans-serif" }}
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-blue-900">🚗 Visit Summary</h3>
            <div className="space-y-4 text-blue-900 text-lg">
              <div className="flex justify-between"><span className="font-semibold">Garage:</span><span>{exitData.garage_name}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Spot:</span><span>#{exitData.spot_id}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Entry Time:</span><span>{formatTime(exitData.start_time)}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Exit Time:</span><span>{formatTime(exitData.end_time)}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Total Duration:</span><span>{formatDuration(exitData.total_duration_minutes)}</span></div>
              <div className="flex justify-between text-base">
                <span className="font-semibold">Wallet Before:</span>
                <span>{(exitData.wallet_balance + exitData.actual_cost).toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-3">
                <span>Total Cost:</span>
                <span className="text-green-600">{exitData.actual_cost} EGP</span>
              </div>
              <div className="flex justify-between text-base border-t pt-3">
                <span className="font-semibold">Wallet After:</span>
                <span className="text-blue-600 font-semibold">{exitData.wallet_balance.toFixed(2)} EGP</span>
              </div>
            </div>
            <div className="mt-6 border-t pt-5">
              <p className="font-semibold mb-3 text-blue-900 text-lg">Rate your experience:</p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`cursor-pointer text-3xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {/* <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment (optional)"
                className="w-full mt-4 p-3 border border-gray-300 rounded text-lg"
                rows={3}
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
              /> */}
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={closeExitPopup}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-xl text-xl font-semibold transition"
              >
                Close
              </button>
              <button
                onClick={handleRescan}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-xl font-semibold transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentBooking;



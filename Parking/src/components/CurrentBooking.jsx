import React, { useState, useEffect } from "react";
import axios from "axios";
import { RotateCcw, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
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
  const [comment, setComment] = useState(""); // Optional لو حابة تعليق

  
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
      const res = await axios.post(
        "http://localhost:8000/api/token/refresh/",
        { refresh: JSON.parse(tokens).refresh }
      );
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
    

    


    // const diff = Math.floor((now - start) / 1000);
    // const mins = Math.floor(diff / 60);
    // const secs = diff % 60;
    // setTimeText(`${label} ${mins}m ${secs}s`);
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
              comment, // لو بتستخدميه
            },
          });
          toast.success("Thank you for your review!");
          setShowExitPopup(false);
          setRating(0);
          setComment("");
          
        } catch (err) {
          toast.error("Failed to submit review.");
          console.error(err.response?.data || err.message);
        }
     };
  useEffect(() => {
    const token = getAccessToken();
    token ? fetchActiveBooking() : (setError("Please login first"), setLoading(false));
  }, []);

  const closeExitPopup = () => {
    setShowExitPopup(false);
    setRating(0);
    setComment("");
    setExitData(null);
    
  };
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
      <div className="min-h-screen p-4">
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
    <div className="min-h-screen p-4">
      <div className="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Booking Details</h1>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>

      <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Booking Info</h2>
          <p><strong>Garage:</strong> {booking.garage_name}</p>
          <p><strong>Spot:</strong> #{booking.parking_spot}</p>
          <p><strong>Estimated Cost:</strong> {booking.estimated_cost} EGP</p>
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Expiry:</strong> {formatTime(booking.reservation_expiry_time)}</p>
          <p><strong>Timer:</strong> {timeText || "Calculating..."}</p>

          {booking.status === "pending" && (
            <button
              onClick={cancelBooking}
              disabled={cancelLoading}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
            >
              <Trash2 className="inline w-4 h-4 mr-2" />{" "}
              {cancelLoading ? "Cancelling..." : "Cancel"}
            </button>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-lg font-bold mb-4">QR Code</h2>
          <img
            src={`http://localhost:8000${booking.qr_code_image}`}
            alt="QR"
            className="w-48 h-48 mx-auto"
          />
          <p className="mt-2 text-sm">Scan at the garage</p>

          <div className="mt-4">
            <button
              onClick={fetchActiveBooking}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <RotateCcw className="inline-block w-4 h-4 mr-2" /> Refresh
            </button>
          </div>
        </div>
      </div>

      {booking.status === "awaiting_response" && booking.late_alert_sent && (
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md mt-6 max-w-xl mx-auto text-center">
          <p>Reservation expired. Confirm or cancel now.</p>
          <div className="flex gap-4 justify-center mt-3">
            <button
              onClick={handleConfirmLate}
              disabled={confirmingLate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              {confirmingLate ? "Confirming..." : "✅ Confirm"}
            </button>
            <button
              onClick={handleCancelLate}
              disabled={cancellingLate}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              {cancellingLate ? "Cancelling..." : "❌ Cancel"}
            </button>
          </div>
        </div>
      )}
      {showExitPopup && exitData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-center">🚗 Visit Summary</h3>
      
            <div className="space-y-3">
              <div className="flex justify-between"><span className="font-semibold">Garage:</span><span>{exitData.garage_name}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Spot:</span><span>#{exitData.spot_id}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Entry Time:</span><span>{formatTime(exitData.start_time)}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Exit Time:</span><span>{formatTime(exitData.end_time)}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Total Duration:</span><span>{formatDuration(exitData.total_duration_minutes)}</span></div>
               <div className="flex justify-between text-sm">
                <span className="font-semibold">Wallet Before:</span>
                <span>{(exitData.wallet_balance + exitData.actual_cost).toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total Cost:</span><span className="text-green-600">{exitData.actual_cost} EGP</span></div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="font-semibold">Wallet After:</span>
                <span className="text-blue-600 font-semibold">{exitData.wallet_balance.toFixed(2)} EGP</span>
              </div>
            </div>
      
            <div className="mt-4 border-t pt-4">
              <p className="font-semibold mb-2">Rate your experience:</p>
              <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`cursor-pointer text-2xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment (optional)"
                className="w-full mt-3 p-2 border border-gray-300 rounded"
                rows={3}
              />
            </div>
      
            <div className="mt-6 flex gap-2">
              <button
                onClick={closeExitPopup}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
              <button
                onClick={handleRescan}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
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

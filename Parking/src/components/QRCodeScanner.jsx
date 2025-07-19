import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

const QRCodeScanner = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const [scanned, setScanned] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [exitData, setExitData] = useState(null);

  const getAuthTokens = () => {
    return sessionStorage.getItem("authTokens") || localStorage.getItem("authTokens");
  };

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
    if (!refreshToken) {
      console.error('No refresh token available');
      return null;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/token/refresh/", {
        refresh: refreshToken,
      });

      const newTokens = {
        ...JSON.parse(getAuthTokens()),
        access: res.data.access,
      };

      if (sessionStorage.getItem("authTokens")) {
        sessionStorage.setItem("authTokens", JSON.stringify(newTokens));
      } else {
        localStorage.setItem("authTokens", JSON.stringify(newTokens));
      }

      return res.data.access;
    } catch (err) {
      console.error("Failed to refresh token", err);
      sessionStorage.removeItem("authTokens");
      localStorage.removeItem("authTokens");
      return null;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hr ${mins} min`;
  };

  const handleQRScan = async (data) => {
    if (scanned) return;

    try {
      const parsed = JSON.parse(data);
      if (!parsed.id) throw new Error("QR code does not contain a valid booking ID.");

      setScanned(true);

      let accessToken = getAccessToken();
      if (!accessToken) throw new Error("No token found. Please login again.");

      let response;
      try {
        response = await axios.post(
          "http://localhost:8000/api/bookings/scanner/",
          { booking_id: parsed.id },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      } catch (err) {
        if (err.response?.status === 401) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            response = await axios.post(
              "http://localhost:8000/api/bookings/scanner/",
              { booking_id: parsed.id },
              {
                headers: { Authorization: `Bearer ${newAccessToken}` },
              }
            );
          } else {
            throw new Error("Failed to refresh token. Please login again.");
          }
        } else {
          throw err;
        }
      }

      if (response.data.action === "exit") {
        setExitData(response.data);
        setShowExitPopup(true);
      } else {
        setMessage(response.data.message);
        setMessageType("success");
      }
    } catch (err) {
      console.error('QR Scan Error:', err);
      let errorMessage = "Failed to scan or invalid QR code.";

      if (err.message.includes('refresh') || err.message.includes('login')) {
        errorMessage = "Session expired. Please login again.";
      } else if (err.response?.data?.error) {
        errorMessage = `${err.response.data.error}`;
      }

      setMessage(errorMessage);
      setMessageType("error");
    }
  };

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      handleQRScan,
      (error) => console.warn("Error while scanning", error)
    );
  };

  useEffect(() => {
    if (!scanned) startScanner();
  }, [scanned]);

  const handleRescan = () => {
    setMessage("");
    setMessageType("");
    setScanned(false);
    setShowExitPopup(false);
    setExitData(null);
    document.getElementById("reader").innerHTML = "";
  };

  const closeExitPopup = () => {
    setShowExitPopup(false);
    setExitData(null);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Scan QR Code for Entry or Exit</h2>

      <div id="reader" className="mb-4"></div>

      {message && (
        <div className={`p-3 rounded-md text-white mb-4 ${
          messageType === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          {message}
        </div>
      )}

      {scanned && !showExitPopup && (
        <button
          onClick={handleRescan}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          🔁 Rescan
        </button>
      )}

      {showExitPopup && exitData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-center">🚗 Visit Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-semibold">Garage:</span>
                <span>{exitData.garage_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Spot:</span>
                <span>#{exitData.spot_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entry Time:</span>
                <span>{formatTime(exitData.start_time)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Exit Time:</span>
                <span>{formatTime(exitData.end_time)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Duration:</span>
                <span>{formatDuration(exitData.total_duration_minutes)}</span>
              </div>

              {exitData.wallet_balance !== undefined && exitData.actual_cost !== undefined && (
            <>
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Wallet Before:</span>
                <span>{(exitData.wallet_balance + exitData.actual_cost).toFixed(2)} EGP</span>
              </div>
          
              <div className="flex justify-between text-sm text-red-600">
                <span className="font-semibold">Deducted:</span>
                <span>- {exitData.actual_cost.toFixed(2)} EGP</span>
              </div>
          
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="font-semibold">Wallet After:</span>
                <span className="text-blue-600 font-semibold">{exitData.wallet_balance.toFixed(2)} EGP</span>
              </div>
            </>
          )}

              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Cost:</span>
                <span className="text-green-600">{exitData.actual_cost?.toFixed(2)} EGP</span>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <p className="font-semibold mb-2">Rate your experience:</p>
              <div className="flex gap-1">
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
                Rescan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;

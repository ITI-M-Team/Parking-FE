import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

const QRCodeScanner = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const [scanned, setScanned] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [exitData, setExitData] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const parsed = JSON.parse(tokens);
      return parsed.refresh;
    } catch (error) {
      console.error("Error parsing tokens:", error);
      return null;
    }
  };

  const getCurrentUserId = () => {
    const tokens = getAuthTokens();
    if (!tokens) return null;
    try {
      const parsed = JSON.parse(tokens);
      const accessToken = parsed.access;
      if (!accessToken) return null;
      
      // Decode JWT payload (base64 decode the middle part)
      const payload = accessToken.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.user_id;
    } catch (error) {
      console.error("Error getting user ID:", error);
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
      console.log("Token refreshed successfully");
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

  // Fetch user's bookings for debugging
  const fetchUserBookings = async () => {
    setLoading(true);
    const accessToken = getAccessToken();
    if (!accessToken) {
      setDebugInfo("❌ No access token found. Please login first.");
      setLoading(false);
      return;
    }

    try {
      // Try to get active booking first
      const activeResponse = await axios.get("http://localhost:8000/api/bookings/active/", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (activeResponse.data && !activeResponse.data.exit_summary) {
        setUserBookings([activeResponse.data]);
        setDebugInfo(`✅ Found active booking: ID ${activeResponse.data.id}, Status: ${activeResponse.data.status}`);
      } else {
        setUserBookings([]);
        setDebugInfo("ℹ️ No active bookings found");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setUserBookings([]);
        setDebugInfo("ℹ️ No active bookings found");
      } else if (err.response?.status === 401) {
        // Try to refresh token
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry with new token
          try {
            const retryResponse = await axios.get("http://localhost:8000/api/bookings/active/", {
              headers: { Authorization: `Bearer ${newToken}` }
            });
            if (retryResponse.data && !retryResponse.data.exit_summary) {
              setUserBookings([retryResponse.data]);
              setDebugInfo(`✅ Found active booking: ID ${retryResponse.data.id}, Status: ${retryResponse.data.status}`);
            }
          } catch (retryErr) {
            setDebugInfo("❌ Failed to fetch bookings after token refresh");
          }
        } else {
          setDebugInfo("❌ Authentication failed and token refresh failed");
        }
      } else {
        setDebugInfo(`❌ Error fetching bookings: ${err.response?.status || err.message}`);
      }
    }
    setLoading(false);
  };

  // Test specific booking ID
  const testSpecificBooking = async (bookingId) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setDebugInfo("❌ No access token found. Please login first.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/bookings/${bookingId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      setDebugInfo(`✅ Booking ${bookingId} exists: ${JSON.stringify(response.data, null, 2)}`);
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        setDebugInfo(`❌ Booking ${bookingId} not found or doesn't belong to current user`);
      } else if (err.response?.status === 401) {
        setDebugInfo(`❌ Authentication failed for booking ${bookingId}`);
      } else {
        setDebugInfo(`❌ Error checking booking ${bookingId}: ${err.response?.status || err.message}`);
      }
      return null;
    }
  };

  const handleQRScan = async (data) => {
    if (scanned) return;

    console.log("🎯 === QR SCAN STARTED ===");
    console.log("📱 Raw QR data:", data);
    
    try {
      // Step 1: Parse QR data
      let parsed;
      try {
        parsed = JSON.parse(data);
        console.log("✅ QR data parsed successfully:", parsed);
      } catch (parseError) {
        console.error("❌ QR parse error:", parseError);
        throw new Error("QR code contains invalid JSON format");
      }
      
      // Step 2: Validate QR structure
      if (!parsed.id) {
        console.error("❌ QR validation failed: Missing booking ID");
        throw new Error("QR code missing booking ID");
      }
      
      console.log("✅ QR validation passed. Booking ID:", parsed.id);
      setScanned(true);

      // Step 3: Get tokens and user info
      let accessToken = getAccessToken();
      const userId = getCurrentUserId();
      console.log("🔑 Authentication info:");
      console.log("- Access token:", accessToken ? "Present" : "Missing");
      console.log("- User ID:", userId);
      
      if (!accessToken) {
        throw new Error("No access token found. Please login again");
      }

      // Step 4: Prepare request
      const requestUrl = "http://localhost:8000/api/bookings/scanner/";
      const requestData = { booking_id: parsed.id };
      const requestHeaders = { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      
      console.log("🚀 Request details:");
      console.log("- URL:", requestUrl);
      console.log("- Data:", requestData);

      // Step 5: Make request
      let response;
      try {
        console.log("📡 Making API request...");
        response = await axios.post(requestUrl, requestData, { headers: requestHeaders });
        console.log("✅ API request successful:", response.data);
      } catch (err) {
        console.error("❌ API request failed:");
        console.error("- Status:", err.response?.status);
        console.error("- Error Data:", err.response?.data);
        
        // Handle 401 with token refresh
        if (err.response?.status === 401) {
          console.log("🔄 Token expired, attempting refresh...");
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            console.log("✅ Token refreshed successfully, retrying...");
            response = await axios.post(requestUrl, requestData, {
              headers: { 
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json'
              },
            });
            console.log("✅ Retry after refresh successful:", response.data);
          } else {
            throw new Error("Session expired and refresh failed. Please login again");
          }
        } else {
          throw err;
        }
      }

      // Step 6: Handle response
      console.log("🎉 Processing response:", response.data);
      
      if (response.data.action === "exit") {
        console.log("🚪 Exit action detected, showing popup");
        setExitData({
          garage_name: parsed.garage_name || "Unknown Garage",
          spot_id: parsed.spot_id || "Unknown",
          start_time: response.data.start_time,
          end_time: response.data.end_time,
          total_duration_minutes: response.data.total_duration_minutes,
          actual_cost: response.data.actual_cost
        });
        setShowExitPopup(true);
      } else {
        console.log("🏁 Entry action detected, showing message");
        setMessage(response.data.message || "QR scan successful");
        setMessageType("success");
      }

      console.log("✅ === QR SCAN COMPLETED SUCCESSFULLY ===");

    } catch (err) {
      console.error("💥 === QR SCAN FAILED ===");
      console.error("Error details:", err);
      
      let errorMessage = "Failed to process QR code";

      if (err.message.includes('JSON')) {
        errorMessage = "Invalid QR code format - not readable";
      } else if (err.message.includes('booking ID')) {
        errorMessage = "QR code is missing required booking information";
      } else if (err.message.includes('login') || err.message.includes('token')) {
        errorMessage = "Session expired. Please login again";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 404) {
        errorMessage = "Booking not found - QR code may be invalid or expired";
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.error || "Invalid booking state for this action";
      } else if (err.response?.status === 403) {
        errorMessage = "You are not authorized to scan this QR code";
      }

      setMessage(errorMessage);
      setMessageType("error");
      setScanned(true);
    }
  };

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
    });

    scanner.render(
      handleQRScan,
      (error) => {
        // Only log actual errors, not scanning attempts
        if (!error.includes("NotFoundException")) {
          console.warn("Scanner error:", error);
        }
      }
    );
  };

  useEffect(() => {
    if (!scanned) startScanner();
  }, [scanned]);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const handleRescan = () => {
    console.log("🔄 Resetting scanner...");
    setMessage("");
    setMessageType("");
    setScanned(false);
    setShowExitPopup(false);
    setExitData(null);
    document.getElementById("reader").innerHTML = "";
    fetchUserBookings(); // Refresh bookings on rescan
  };

  const closeExitPopup = () => {
    setShowExitPopup(false);
    setExitData(null);
  };

  // Function to test with a booking ID from your active bookings
  const testWithValidBookingId = async () => {
    if (userBookings.length === 0) {
      alert("No active bookings found. Please create a booking first.");
      return;
    }
    
    const booking = userBookings[0];
    const fakeQRData = JSON.stringify({
      id: booking.id,
      garage_name: booking.garage?.name || "Test Garage",
      spot_id: booking.parking_spot?.id || 1,
      status: booking.status
    });
    console.log("🧪 Testing with valid booking QR:", fakeQRData);
    await handleQRScan(fakeQRData);
  };

  // Function to manually test with any booking ID
  const testWithManualBookingId = async () => {
    const bookingIdInput = prompt("Enter a booking ID to test:");
    if (bookingIdInput) {
      const bookingId = parseInt(bookingIdInput);
      if (isNaN(bookingId)) {
        alert("Please enter a valid number for booking ID");
        return;
      }
      
      // First check if booking exists
      const bookingData = await testSpecificBooking(bookingId);
      if (!bookingData) {
        return; // Error already shown in testSpecificBooking
      }
      
      const fakeQRData = JSON.stringify({
        id: bookingId,
        garage_name: "Test Garage",
        spot_id: 1,
        status: "pending"
      });
      console.log("🧪 Testing with manual QR:", fakeQRData);
      await handleQRScan(fakeQRData);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Scan QR Code for Entry or Exit</h2>
       
      {/* User Info & Debug section */}
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <div className="text-sm mb-2">
          <strong>Current User ID:</strong> {getCurrentUserId() || "Unknown"}
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={fetchUserBookings}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-1 rounded text-sm"
          >
            {loading ? "Loading..." : "🔄 Refresh My Bookings"}
          </button>
          
          {userBookings.length > 0 && (
            <button
              onClick={testWithValidBookingId}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              🎯 Test with My Active Booking
            </button>
          )}
          
          <button
            onClick={testWithManualBookingId}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
          >
            🧪 Test with Manual Booking ID
          </button>
        </div>
        
        {/* Active bookings display */}
        {userBookings.length > 0 && (
          <div className="mt-3 p-2 bg-green-50 rounded">
            <div className="text-sm font-semibold text-green-800">Your Active Booking:</div>
            {userBookings.map(booking => (
              <div key={booking.id} className="text-xs text-green-700">
                ID: {booking.id} | Status: {booking.status} | 
                Garage: {booking.garage?.name || 'N/A'} | 
                Spot: {booking.parking_spot?.spot_number || 'N/A'}
              </div>
            ))}
          </div>
        )}
        
        {debugInfo && (
          <div className="text-sm font-mono bg-white p-2 rounded border mt-2 whitespace-pre-wrap">
            {debugInfo}
          </div>
        )}
        
        {/* Token status display */}
        <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
          <div><strong>Access Token:</strong> {getAccessToken() ? "✅ Present" : "❌ Missing"}</div>
          <div><strong>Refresh Token:</strong> {getRefreshToken() ? "✅ Present" : "❌ Missing"}</div>
        </div>
      </div>

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
          🔁 Rescan QR Code
        </button>
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
              <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total Cost:</span><span className="text-green-600">{exitData.actual_cost} EGP</span></div>
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={closeExitPopup} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">Close</button>
              <button onClick={handleRescan} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Rescan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
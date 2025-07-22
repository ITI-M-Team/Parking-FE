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
// import React, { useEffect, useState } from "react";
// import { Html5QrcodeScanner } from "html5-qrcode";
// import axios from "axios";
// import { useLanguage } from '../context/LanguageContext'; 

// const QRCodeScanner1 = () => {
//   const { language } = useLanguage(); 

//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState(""); 
//   const [scanned, setScanned] = useState(false);
//   const [showExitPopup, setShowExitPopup] = useState(false);
//   const [exitData, setExitData] = useState(null);
//   const [debugInfo, setDebugInfo] = useState("");


//   const t = {
//     en: {
//       title: "Scan QR Code for Entry or Exit",
//       scanStart: "Starting scanner...",
//       rescan: "Rescan QR Code",
//       exitSummary: "Visit Summary",
//       garage: "Garage",
//       spot: "Spot",
//       entryTime: "Entry Time",
//       exitTime: "Exit Time",
//       totalDuration: "Total Duration",
//       walletBefore: "Wallet Before",
//       deducted: "Deducted",
//       walletAfter: "Wallet After",
//       totalCost: "Total Cost",
//       rateExperience: "Rate your experience:",
//       close: "Close",
//       testEndpoint: "Test Endpoint",
//       testWithId: "Test with Booking ID",
//       debugSection: "Debug Section",
//       tokenStatus: "Token Status",
//       present: "Present",
//       missing: "Missing"
//     },
//     ar: {
//       title: "مسح رمز الاستجابة السريعة للدخول أو الخروج",
//       scanStart: "جاري تشغيل الماسح...",
//       rescan: "إعادة مسح الرمز",
//       exitSummary: "ملخص الزيارة",
//       garage: "الجراج",
//       spot: "المكان",
//       entryTime: "وقت الدخول",
//       exitTime: "وقت الخروج",
//       totalDuration: "المدة الكلية",
//       walletBefore: "المحفظة قبل",
//       deducted: "تم خصم",
//       walletAfter: "المحفظة بعد",
//       totalCost: "التكلفة الإجمالية",
//       rateExperience: "قيّم تجربتك:",
//       close: "إغلاق",
//       testEndpoint: "اختبار النقطة النهائية",
//       testWithId: "اختبار بمعرف الحجز",
//       debugSection: "قسم التصحيح",
//       tokenStatus: "حالة الرمز",
//       present: "موجود",
//       missing: "مفقود"
//     }
//   };

//   const getAuthTokens = () => {
//     return sessionStorage.getItem("authTokens") || localStorage.getItem("authTokens");
//   };

//   const getAccessToken = () => {
//     const tokens = getAuthTokens();
//     if (!tokens) return null;
//     try {
//       return JSON.parse(tokens).access;
//     } catch {
//       return null;
//     }
//   };

//   const getRefreshToken = () => {
//     const tokens = getAuthTokens();
//     if (!tokens) return null;
//     try {
//       return JSON.parse(tokens).refresh;
//     } catch {
//       return null;
//     }
//   };

//   const refreshAccessToken = async () => {
//     const refreshToken = getRefreshToken();
//     if (!refreshToken) {
//       console.error('No refresh token available');
//       return null;
//     }
//     try {
//       const res = await axios.post("http://localhost:8000/api/token/refresh/", {
//         refresh: refreshToken,
//       });
//       const newTokens = {
//         ...JSON.parse(getAuthTokens()),
//         access: res.data.access,
//       };
//       if (sessionStorage.getItem("authTokens")) {
//         sessionStorage.setItem("authTokens", JSON.stringify(newTokens));
//       } else {
//         localStorage.setItem("authTokens", JSON.stringify(newTokens));
//       }
//       console.log("Token refreshed successfully");
//       return res.data.access;
//     } catch (err) {
//       console.error("Failed to refresh token", err);
//       sessionStorage.removeItem("authTokens");
//       localStorage.removeItem("authTokens");
//       return null;
//     }
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-GB', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   const formatDuration = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours} hr ${mins} min`;
//   };

//   const testEndpoint = async () => {
//     console.log("🔍 Starting comprehensive endpoint test...");
//     const tokens = getAuthTokens();
//     const accessToken = getAccessToken();
//     const refreshToken = getRefreshToken();
//     console.log("🔐 Token Analysis:");
//     console.log("Raw tokens string:", tokens ? "Present" : "Missing");
//     console.log("Access token:", accessToken ? `${accessToken.substring(0, 50)}...` : "Missing");
//     console.log("Refresh token:", refreshToken ? `${refreshToken.substring(0, 50)}...` : "Missing");
//     if (!accessToken) {
//       setDebugInfo("❌ No access token found. Please login first.");
//       return;
//     }
//     try {
//       const testResponse = await axios.post("http://localhost:8000/api/bookings/scanner/", 
//         { booking_id: 999999 },
//         {
//           headers: { 
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json'
//           },
//         }
//       );
//       setDebugInfo("✅ Endpoint is working perfectly!");
//     } catch (err) {
//       let status = err.response?.status;
//       let errorData = err.response?.data;
//       if (status === 404 && errorData?.error === "Invalid QR.") {
//         setDebugInfo("✅ Endpoint is working! (404 expected for test booking ID)");
//       } else if (status === 401) {
//         setDebugInfo("⚠️ Authentication failed. Token might be expired.");
//       } else if (status === 400) {
//         setDebugInfo(`✅ Endpoint working! Server says: ${errorData?.error || "Bad request"}`);
//       } else if (status === 500) {
//         setDebugInfo("❌ Server error (500). Check Django logs.");
//       } else {
//         setDebugInfo(`⚠️ Unexpected response: ${status} - ${errorData?.error || err.message}`);
//       }
//     }
//   };

//   const handleQRScan = async (data) => {
//     if (scanned) return;
//     console.log("🎯 === QR SCAN STARTED ===");
//     console.log("📱 Raw QR data:", data);
//     try {
//       let parsed;
//       try {
//         parsed = JSON.parse(data);
//         console.log("✅ QR data parsed successfully:", parsed);
//       } catch (parseError) {
//         throw new Error("QR code contains invalid JSON format");
//       }
//       if (!parsed.id) {
//         throw new Error("QR code missing booking ID");
//       }
//       console.log("✅ QR validation passed. Booking ID:", parsed.id);
//       setScanned(true);

//       let accessToken = getAccessToken();
//       let refreshToken = getRefreshToken();
//       console.log("🔑 Token status:");
//       console.log("- Access token:", accessToken ? "Present" : "Missing");
//       console.log("- Refresh token:", refreshToken ? "Present" : "Missing");

//       if (!accessToken) {
//         throw new Error("No access token found. Please login again");
//       }

//       const requestUrl = "http://localhost:8000/api/bookings/scanner/";
//       const requestData = { booking_id: parsed.id };
//       const requestHeaders = { 
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json'
//       };

//       console.log("🚀 Request details:", requestUrl, requestData);
      
//       let response;
//       try {
//         console.log("📡 Making API request...");
//         response = await axios.post(requestUrl, requestData, { headers: requestHeaders });
//         console.log("✅ API request successful:", response.data);
//       } catch (err) {
//         console.error("❌ API request failed:", err);
//         if (err.response?.status === 401) {
//           console.log("🔄 Token expired, attempting refresh...");
//           const newAccessToken = await refreshAccessToken();
//           if (newAccessToken) {
//             console.log("✅ Token refreshed successfully, retrying...");
//             response = await axios.post(requestUrl, requestData, {
//               headers: { 
//                 'Authorization': `Bearer ${newAccessToken}`,
//                 'Content-Type': 'application/json'
//               },
//             });
//             console.log("✅ Retry after refresh successful:", response.data);
//           } else {
//             throw new Error("Session expired and refresh failed. Please login again");
//           }
//         } else {
//           throw err;
//         }
//       }

//       console.log("🎉 Processing response:", response.data);
//       if (response.data.action === "exit") {
//         setExitData({
//           garage_name: parsed.garage_name || "Unknown Garage",
//           spot_id: parsed.spot_id || "Unknown",
//           start_time: response.data.start_time,
//           end_time: response.data.end_time,
//           total_duration_minutes: response.data.total_duration_minutes,
//           actual_cost: response.data.actual_cost,
//           wallet_balance: response.data.wallet_balance
//         });
//         setShowExitPopup(true);
//       } else {
//         setMessage(response.data.message || "QR scan successful");
//         setMessageType("success");
//       }
//       console.log("✅ === QR SCAN COMPLETED SUCCESSFULLY ===");
//     } catch (err) {
//       console.error("💥 === QR SCAN FAILED ===");
//       console.error("Error details:", err);
//       let errorMessage = "Failed to process QR code";
//       if (err.message.includes('JSON')) {
//         errorMessage = "Invalid QR code format - not readable";
//       } else if (err.message.includes('booking ID')) {
//         errorMessage = "QR code is missing required booking information";
//       } else if (err.message.includes('login') || err.message.includes('token')) {
//         errorMessage = "Session expired. Please login again";
//       } else if (err.response?.data?.error) {
//         errorMessage = err.response.data.error;
//       } else if (err.response?.status === 404) {
//         errorMessage = "Booking not found - QR code may be invalid or expired";
//       } else if (err.response?.status === 400) {
//         errorMessage = err.response?.data?.error || "Invalid booking state for this action";
//       }
//       setMessage(errorMessage);
//       setMessageType("error");
//       setScanned(true);
//     }
//   };

//   const startScanner = () => {
//     setMessage(t[language].scanStart);
//     const scanner = new Html5QrcodeScanner("reader", {
//       fps: 10,
//       qrbox: { width: 250, height: 250 },
//       showTorchButtonIfSupported: true,
//       showZoomSliderIfSupported: true,
//     });
//     scanner.render(handleQRScan, (error) => {
//       if (!error.includes("NotFoundException")) {
//         console.warn("Scanner error:", error);
//       }
//     });
//   };

//   useEffect(() => {
//     if (!scanned) startScanner();
//   }, [scanned, language]);

//   const handleRescan = () => {
//     setMessage("");
//     setMessageType("");
//     setScanned(false);
//     setShowExitPopup(false);
//     setExitData(null);
//     setDebugInfo("");
//     document.getElementById("reader").innerHTML = "";
//   };

//   const closeExitPopup = () => {
//     setShowExitPopup(false);
//     setExitData(null);
//   };

//   const testWithBookingId = async () => {
//     const bookingIdInput = prompt(language === 'ar' ? "أدخل رقم الحجز للتجربة:" : "Enter a booking ID to test:");
//     if (bookingIdInput) {
//       const bookingId = parseInt(bookingIdInput);
//       if (isNaN(bookingId)) {
//         alert(language === 'ar' ? "الرجاء إدخال رقم صحيح" : "Please enter a valid number for booking ID");
//         return;
//       }
//       const fakeQRData = JSON.stringify({
//         id: bookingId,
//         garage_name: "Test Garage",
//         spot_id: 1,
//         status: "pending"
//       });
//       await handleQRScan(fakeQRData);
//     }
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h2 className={`text-xl font-bold mb-4 text-center ${language === 'ar' ? 'font-cairo' : ''}`}>
//         {t[language].title}
//       </h2>

//       {/* Debug section */}
//       <div className="mb-4 p-3 bg-gray-100 rounded">
//         <div className="grid grid-cols-1 gap-2">
//           <button
//             onClick={testEndpoint}
//             className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
//           >
//             🧪 {t[language].testEndpoint}
//           </button>
//           <button
//             onClick={testWithBookingId}
//             className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
//           >
//             🎯 {t[language].testWithId}
//           </button>
//         </div>
//         {debugInfo && (
//           <div className="text-sm font-mono bg-white p-2 rounded border mt-2">
//             {debugInfo}
//           </div>
//         )}
//         {/* Token status display */}
//         <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
//           <div><strong>Access Token:</strong> {getAccessToken() ? `✅ ${t[language].present}` : `❌ ${t[language].missing}`}</div>
//           <div><strong>Refresh Token:</strong> {getRefreshToken() ? `✅ ${t[language].present}` : `❌ ${t[language].missing}`}</div>
//         </div>
//       </div>

//       <div id="reader" className="mb-4"></div>

//       {message && (
//         <div className={`p-3 rounded-md text-white mb-4 ${
//           messageType === "success" ? "bg-green-600" : "bg-red-600"
//         }`}>
//           {message}
//         </div>
//       )}

//       {scanned && !showExitPopup && (
//         <button
//           onClick={handleRescan}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full"
//         >
//           🔁 {t[language].rescan}
//         </button>
//       )}

//       {showExitPopup && exitData && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
//             <h3 className="text-lg font-bold mb-4 text-center">{t[language].exitSummary}</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="font-semibold">{t[language].garage}:</span>
//                 <span>{exitData.garage_name}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-semibold">{t[language].spot}:</span>
//                 <span>#{exitData.spot_id}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-semibold">{t[language].entryTime}:</span>
//                 <span>{formatTime(exitData.start_time)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-semibold">{t[language].exitTime}:</span>
//                 <span>{formatTime(exitData.end_time)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-semibold">{t[language].totalDuration}:</span>
//                 <span>{formatDuration(exitData.total_duration_minutes)}</span>
//               </div>
//               {exitData.wallet_balance !== undefined && exitData.actual_cost !== undefined && (
//                 <>
//                   <div className="flex justify-between text-sm">
//                     <span className="font-semibold">{t[language].walletBefore}:</span>
//                     <span>{(exitData.wallet_balance + exitData.actual_cost).toFixed(2)} EGP</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-red-600">
//                     <span className="font-semibold">{t[language].deducted}:</span>
//                     <span>- {exitData.actual_cost.toFixed(2)} EGP</span>
//                   </div>
//                   <div className="flex justify-between text-sm border-t pt-2">
//                     <span className="font-semibold">{t[language].walletAfter}:</span>
//                     <span className="text-blue-600 font-semibold">{exitData.wallet_balance.toFixed(2)} EGP</span>
//                   </div>
//                 </>
//               )}
//               <div className="flex justify-between font-bold text-lg border-t pt-2">
//                 <span>{t[language].totalCost}:</span>
//                 <span className="text-green-600">{exitData.actual_cost?.toFixed(2)} EGP</span>
//               </div>
//             </div>

//             <div className="mt-6 border-t pt-4">
//               <p className="font-semibold mb-2">{t[language].rateExperience}</p>
//               <div className="flex gap-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     onClick={() => handleRating(star)}
//                     className={`cursor-pointer text-2xl ${
//                       star <= rating ? "text-yellow-400" : "text-gray-400"
//                     }`}
//                   >
//                     ★
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-6 flex gap-2">
//               <button
//                 onClick={closeExitPopup}
//                 className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
//               >
//                 {t[language].close}
//               </button>
//               <button
//                 onClick={handleRescan}
//                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
//               >
//                 {t[language].rescan}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QRCodeScanner1;
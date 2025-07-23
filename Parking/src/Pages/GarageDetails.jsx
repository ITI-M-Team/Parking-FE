import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Clock } from "lucide-react";

const themeClasses = {
  background: 'bg-gradient-to-br from-blue-50 to-indigo-100',
  card: 'bg-white border border-gray-200',
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    muted: 'text-gray-500',
  },
  input: 'bg-white border-gray-300 text-gray-900',
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  },
};

const GarageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [garage, setGarage] = useState(null);
  const [spots, setSpots] = useState([]);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const spotsPerPage = 20;

  const isLoggedIn = !!(
    localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens")
  );

  useEffect(() => {
    fetchGarageDetails(id);
    fetchParkingSpots(id);
  }, [id]);

  const fetchGarageDetails = async (garageId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/garages/${garageId}/`);
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || "Garage not found.");
        return;
      }
      const data = await res.json();
      setGarage(data);
    } catch (error) {
      setError("❌ Failed to load garage details.");
    }
  };

  const fetchParkingSpots = async (garageId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/garages/${garageId}/spots/`);
      const data = await res.json();
      setSpots(data);
    } catch (error) {
      console.error("❌ Failed to load parking spots.");
    }
  };

  const handleSpotSelect = (spotId) => setSelectedSpotId(spotId);

  const handleBooking = async () => {
    if (!selectedSpotId) return;

    const storedToken =
      localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
    const token = storedToken ? JSON.parse(storedToken).access : null;

    if (!token) {
      alert("❌ You're not logged in. Please log in to book a spot.");
      navigate("/login");
      return;
    }

    const payload = {
      garage_id: parseInt(id),
      parking_spot_id: parseInt(selectedSpotId),
      estimated_arrival_time: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:8000/api/bookings/initiate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        const fallback = await res.text();
        console.error("❌ Failed to parse response JSON:", fallback);
        alert("🚨 Server error. Please try again later.");
        return;
      }

      if (res.ok) {
        setConfirmationMessage("✅ Booking successful! Redirecting...");
        setTimeout(() => {
          navigate("/currentbooking/");
        }, 2000);
      } else {
        let errorMessage = "❌ Booking failed.";
        if (data.detail) {
          errorMessage += " " + data.detail;
        } else if (data.non_field_errors) {
          errorMessage += " " + data.non_field_errors.join(", ");
        } else if (data.error) {
          errorMessage += " " + data.error;
        } else {
          errorMessage += " " + JSON.stringify(data);
        }
        alert(errorMessage);
      }
    } catch (err) {
      alert("🚨 Unexpected error during booking.");
      console.error("🚨 Booking error:", err);
    }
  };

  const getSpotColor = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-500";
      case "reserved":
        return "bg-yellow-500";
      case "pending":
        return "bg-orange-400";
      case "occupied":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const filteredSpots =
    filter === "all" ? spots : spots.filter((s) => s.status.toLowerCase() === filter);

  const availableCount = spots.filter((s) => s.status.toLowerCase() === "available").length;
  const reservedCount = spots.filter((s) => s.status.toLowerCase() === "reserved").length;
  const pendingCount = spots.filter((s) => s.status.toLowerCase() === "pending").length;
  const occupiedCount = spots.filter((s) => s.status.toLowerCase() === "occupied").length;

  const totalPages = Math.ceil(filteredSpots.length / spotsPerPage);
  const indexOfLast = currentPage * spotsPerPage;
  const indexOfFirst = indexOfLast - spotsPerPage;
  const currentSpots = filteredSpots.slice(indexOfFirst, indexOfLast);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10 bg-white border border-red-500 text-black rounded-lg shadow">
        <h2 className="text-xl font-bold text-red-600">🚫 Error</h2>
        <p className="mt-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-4 py-2 bg-[#CF0018] text-white rounded hover:bg-red-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-10 ${themeClasses.background}`}>
      <div className={`max-w-4xl mx-auto p-6 ${themeClasses.card} rounded-xl shadow-lg`}>
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Garage Details</h1>

        {!garage ? (
          <div className="text-center">Loading garage...</div>
        ) : (
          <>
            <div className="mb-6 bg-gradient-to-br from-blue-100 to-indigo-50 border border-gray-200 rounded-lg shadow p-4 flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-2 text-center text-blue-700">{garage.name}</h2>
              <p className="text-lg font-semibold mb-4 text-blue-700 text-center">{garage.price_per_hour} EGP/hour</p>
              {garage.image && (
                <img
                  src={garage.image}
                  alt={garage.name}
                  className="w-full max-w-5xl h-[22rem] object-cover rounded-lg border mb-6"
                />
              )}
              <div className="flex flex-wrap justify-center gap-6 mt-2">
                <span className={`flex items-center gap-1 ${themeClasses.text.secondary}`}>
                  <MapPin className="w-4 h-4" />
                  {garage.address}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-lg">{garage.average_rating?.toFixed(1) || "No ratings"}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-5 h-5 text-blue-700" />
                  <span className="font-semibold text-lg">
                    {garage.opening_hour?.slice(0, 5)} - {garage.closing_hour?.slice(0, 5)}
                  </span>
                </span>
              </div>
            </div>

            <div className="mb-6 bg-blue-100 rounded-xl p-4 shadow-inner">
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {[
                  { label: "All", value: "all", count: spots.length },
                  { label: "Available", value: "available", count: availableCount },
                  { label: "Reserved", value: "reserved", count: reservedCount },
                  { label: "Pending", value: "pending", count: pendingCount },
                  { label: "Occupied", value: "occupied", count: occupiedCount },
                ].map(({ label, value, count }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setFilter(value);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm font-semibold capitalize ${
                      filter === value
                        ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {currentSpots.map((spot) => (
                  <div
                    key={spot.id}
                    className="bg-white rounded-xl shadow border border-gray-200 flex items-center justify-center h-24"
                  >
                    <button
                      onClick={() => handleSpotSelect(spot.id)}
                      disabled={spot.status.toLowerCase() !== "available"}
                      className={`w-full h-full flex flex-col items-center justify-center font-semibold rounded-lg text-white ${getSpotColor(
                        spot.status
                      )} ${selectedSpotId === spot.id ? "ring-4 ring-blue-400" : ""}`}
                    >
                      <span>{spot.slot_number}</span>
                      <span className="text-xs">{spot.status.toUpperCase()}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border text-sm font-medium ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleBooking}
                disabled={!selectedSpotId || !isLoggedIn}
                className={`px-6 py-3 rounded-lg font-semibold text-white ${
                  selectedSpotId && isLoggedIn
                    ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Confirm Booking
              </button>
            </div>

            {confirmationMessage && (
              <div className="mt-6 text-center text-green-600 font-semibold">
                {confirmationMessage}
              </div>
            )}

            <p className="text-sm text-red-500 text-center mt-4">
              ⚠️ You must arrive before your grace period ends. Otherwise, your booking will expire.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default GarageDetails;

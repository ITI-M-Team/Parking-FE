import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, Star, Clock } from "lucide-react";

const GarageDetails = ({ darkMode, setDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [garage, setGarage] = useState(null);
  const [spots, setSpots] = useState([]);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [arrivalTime, setArrivalTime] = useState(new Date());
  const [bookingDate, setBookingDate] = useState(new Date());
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const spotsPerPage = 20;

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

    const payload = {
      garage_id: parseInt(id),
      parking_spot_id: selectedSpotId,
      estimated_arrival_time: arrivalTime.toISOString(),
    };

    const token = JSON.parse(localStorage.getItem("authTokens"))?.access;

    try {
      const res = await fetch("http://localhost:8000/api/bookings/initiate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setConfirmationMessage("✅ Booking successful! Redirecting...");
        setTimeout(() => {
          navigate(`/booking/confirmation/${data.booking_id}`);
        }, 2000);
      } else {
        alert("❌ Booking failed: " + (data.detail || JSON.stringify(data)));
      }
    } catch (err) {
      alert("🚨 Error during booking.");
      console.error(err);
    }
  };

  const getSpotColor = (status) => {
    switch (status.toLowerCase()) {
      case "available": return "bg-green-500";
      case "reserved": return "bg-yellow-500";
      case "pending": return "bg-orange-400";
      case "occupied": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const filteredSpots = filter === "all"
    ? spots
    : spots.filter((s) => s.status.toLowerCase() === filter);

  const availableCount = spots.filter(s => s.status.toLowerCase() === "available").length;
  const reservedCount = spots.filter(s => s.status.toLowerCase() === "reserved").length;
  const pendingCount = spots.filter(s => s.status.toLowerCase() === "pending").length;
  const occupiedCount = spots.filter(s => s.status.toLowerCase() === "occupied").length;

  const totalPages = Math.ceil(filteredSpots.length / spotsPerPage);
  const indexOfLast = currentPage * spotsPerPage;
  const indexOfFirst = indexOfLast - spotsPerPage;
  const currentSpots = filteredSpots.slice(indexOfFirst, indexOfLast);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 border border-red-500 text-black dark:text-white rounded-lg shadow">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400">🚫 Error</h2>
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
    <div className={`max-w-4xl mx-auto p-6 mt-10 border-2 rounded-xl shadow-lg transition-colors duration-300 ${
      darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-black border-[#CF0018]"
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-[#CF0018]">Garage Details</h1>
        <button
          onClick={() => {
            const newMode = !darkMode;
            setDarkMode(newMode);
            localStorage.setItem("darkMode", newMode);
            document.documentElement.classList.toggle("dark", newMode);
          }}
          className="px-4 py-2 border rounded text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>

      {!garage ? (
        <div className="text-center">Loading garage...</div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-2">{garage.name}</h2>
          <p className="text-lg font-semibold mb-4">{garage.price_per_hour} EGP/hour</p>

          {garage.image && (
            <img
              src={garage.image}
              alt={garage.name}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{garage.address}</span>
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" />{garage.average_rating?.toFixed(1) || "No ratings"}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{garage.opening_hour?.slice(0, 5)} - {garage.closing_hour?.slice(0, 5)}</span>
          </div>

          {/* Booking Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Booking Date</label>
              <DatePicker
                selected={bookingDate}
                onChange={(date) => setBookingDate(date)}
                minDate={new Date()}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Arrival Time</label>
              <DatePicker
                selected={arrivalTime}
                onChange={(date) => setArrivalTime(date)}
                showTimeSelect
                timeIntervals={15}
                dateFormat="Pp"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
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
                    ? "bg-[#CF0018] text-white"
                    : "bg-white dark:bg-gray-700 text-[#CF0018] border-[#CF0018]"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Parking Spots */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {currentSpots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => handleSpotSelect(spot.id)}
                disabled={spot.status.toLowerCase() !== "available"}
                className={`h-20 flex flex-col items-center justify-center font-semibold rounded-lg text-white ${getSpotColor(spot.status)} ${selectedSpotId === spot.id ? "ring-4 ring-blue-400" : ""}`}
              >
                <span>{spot.slot_number}</span>
                <span className="text-xs">{spot.status.toUpperCase()}</span>
              </button>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border text-sm font-medium ${
                  currentPage === i + 1
                    ? "bg-[#CF0018] text-white"
                    : "bg-white dark:bg-gray-700 text-[#CF0018] border-[#CF0018]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Confirm Booking Button */}
          <div className="flex justify-end">
            <button
              onClick={handleBooking}
              disabled={!selectedSpotId}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                selectedSpotId ? "bg-[#FF8C42] hover:bg-[#e57a32]" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Booking
            </button>
          </div>

          {/* Confirmation Message */}
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
  );
};

export default GarageDetails;

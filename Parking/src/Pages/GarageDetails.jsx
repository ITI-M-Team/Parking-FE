import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, Star, Clock } from "lucide-react";

const GarageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [garage, setGarage] = useState(null);
  const [spots, setSpots] = useState([]);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [arrivalTime, setArrivalTime] = useState(new Date());
  const [bookingDate, setBookingDate] = useState(new Date());
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    fetchGarageDetails(id);
    fetchParkingSpots(id);
  }, [id]);

  const fetchGarageDetails = async (garageId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/garages/${garageId}/`);
      const data = await res.json();
      setGarage(data);
    } catch (error) {
      alert("⚠️ Failed to load garage details.");
    }
  };

  const fetchParkingSpots = async (garageId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/garages/${garageId}/spots/`);
      const data = await res.json();
      setSpots(data);
    } catch (error) {
      alert("⚠️ Failed to load parking spots.");
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

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white border-2 border-[#CF0018] rounded-xl shadow-lg">
      {!garage ? (
        <div className="text-center">Loading garage...</div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-[#CF0018] mb-2">{garage.name}</h1>
          <p className="text-gray-700 font-semibold mb-4">{garage.price_per_hour} EGP/hour</p>

          {garage.image && (
            <img
              src={garage.image}
              alt={garage.name}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{garage.address}</span>
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" />{garage.average_rating?.toFixed(1) || "No ratings"}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{garage.opening_hour?.slice(0, 5)} - {garage.closing_hour?.slice(0, 5)}</span>
          </div>

          {/* DatePickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Booking Date</label>
              <DatePicker
                selected={bookingDate}
                onChange={(date) => setBookingDate(date)}
                minDate={new Date()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Spot Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {spots.map((spot) => (
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

          {/* Confirm Booking */}
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

          {/* Warning Note */}
          <p className="text-sm text-red-500 text-center mt-4">
            ⚠️ You must arrive before your grace period ends. Otherwise, your booking will expire.
          </p>
        </>
      )}
    </div>
  );
};

export default GarageDetails;

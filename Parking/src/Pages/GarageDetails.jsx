import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, Star, Clock } from "lucide-react";

const GarageDetails = () => {
  const { id } = useParams();
  const [garage, setGarage] = useState(null);
  const [spots, setSpots] = useState([]);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [arrivalTime, setArrivalTime] = useState(new Date());
  const [bookingDate, setBookingDate] = useState(new Date());
  const [loadingSpots, setLoadingSpots] = useState(true);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);

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
      setError("Failed to load garage details.");
      console.error(error);
    }
  };

  const fetchParkingSpots = async (garageId) => {
    setLoadingSpots(true);
    try {
      const res = await fetch(`http://localhost:8000/api/garages/${garageId}/spots/`);
      const data = await res.json();
      setSpots(data);
    } catch (error) {
      setError("Failed to load parking spots.");
      console.error(error);
    } finally {
      setLoadingSpots(false);
    }
  };

  const handleSpotSelect = (id) => {
    setSelectedSpotId(id);
  };

  const handleBooking = async () => {
    if (!selectedSpotId) return;

    const payload = {
      spot_id: selectedSpotId,
      date: bookingDate.toISOString().split("T")[0],
      time: arrivalTime.toTimeString().slice(0, 5),
    };

    try {
      const res = await fetch(`http://localhost:8000/api/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setBookingStatus("success");
        alert("Booking successful!");
        fetchParkingSpots(id); // Refresh spot status
      } else {
        setBookingStatus("error");
        const err = await res.json();
        alert("Booking failed: " + (err.detail || "Unknown error"));
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingStatus("error");
      alert("Booking failed. Please try again.");
    }
  };

  const isPastDate = bookingDate < new Date(new Date().setHours(0, 0, 0, 0));

  if (!garage) return <div className="text-center mt-10">Loading garage details...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white border-2 border-[#CF0018] rounded-[20px] mt-10 shadow-md">
      {/* Title */}
      <h2 className="text-3xl font-bold text-[#CF0018] mb-1">{garage.name}</h2>
      <p className="text-lg font-semibold text-gray-700 mb-4">
        {garage.price_per_hour} EGP/hour
      </p>

      {/* Garage Image */}
      {garage.image && (
        <img
          src={garage.image}
          alt={garage.name}
          className="w-full h-64 object-cover rounded-xl mb-6 border"
        />
      )}

      {/* Info row */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
        <span className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#FF8C42]" />
          {garage.address}
        </span>
        <span className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          {garage.average_rating ? garage.average_rating.toFixed(1) : "No ratings yet"}
        </span>
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          {garage.opening_hour?.slice(0, 5)} - {garage.closing_hour?.slice(0, 5)}
        </span>
      </div>

      {/* Map */}
      {garage.latitude && garage.longitude && (
        <div className="mb-8">
          <iframe
            title="Garage Map"
            width="100%"
            height="300"
            frameBorder="0"
            style={{ borderRadius: "10px" }}
            src={`https://www.google.com/maps?q=${garage.latitude},${garage.longitude}&z=15&output=embed`}
            allowFullScreen
          />
        </div>
      )}

      {/* Input fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Booking Date</label>
          <DatePicker
            selected={bookingDate}
            onChange={(date) => setBookingDate(date)}
            minDate={new Date()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF0018]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Arrival Time</label>
          <DatePicker
            selected={arrivalTime}
            onChange={(date) => setArrivalTime(date)}
            showTimeSelect
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="Pp"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF0018]"
          />
        </div>
      </div>

      {/* Spots */}
      <h3 className="text-md font-bold text-[#CF0018] mb-3">Available Spots</h3>
      {loadingSpots ? (
        <p>Loading spots...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {spots.length === 0 ? (
            <p>No spots available.</p>
          ) : (
            spots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => handleSpotSelect(spot.id)}
                disabled={spot.status !== "available"}
                className={`py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                  spot.status === "occupied"
                    ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                    : selectedSpotId === spot.id
                    ? "bg-[#CF0018] text-white border-[#CF0018]"
                    : "bg-white text-[#CF0018] border-[#CF0018] hover:bg-[#FFE5E9]"
                }`}
              >
                Spot {spot.number}
              </button>
            ))
          )}
        </div>
      )}

      {/* Confirm button */}
      <div className="flex justify-end">
        <button
          onClick={handleBooking}
          disabled={!selectedSpotId || isPastDate}
          className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors ${
            !selectedSpotId || isPastDate
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#FF8C42] hover:bg-[#e57a32]"
          }`}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default GarageDetails;

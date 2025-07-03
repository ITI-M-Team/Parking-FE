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
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const spotsPerPage = 15;

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

  const handleSpotSelect = (spotId) => {
    setSelectedSpotId(spotId);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setBookingStatus("success");
        alert("Booking successful!");
        fetchParkingSpots(id);
      } else {
        setBookingStatus("error");
        const err = await res.json();
        alert("Booking failed: " + (err.detail || JSON.stringify(err)));
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingStatus("error");
      alert("Booking failed. Please try again.");
    }
  };

  const isPastDate = bookingDate < new Date(new Date().setHours(0, 0, 0, 0));

  const getSpotColor = (status) => {
    switch (status.trim().toLowerCase()) {
      case "available": return "bg-green-500";
      case "occupied": return "bg-red-500";
      case "reserved": return "bg-yellow-500";
      default: return "bg-gray-300";
    }
  };

  const filteredSpots = filter === "all"
    ? spots
    : spots.filter(s => s.status.trim().toLowerCase() === filter);

  const availableCount = spots.filter(s => s.status.trim().toLowerCase() === "available").length;
  const occupiedCount = spots.filter(s => s.status.trim().toLowerCase() === "occupied").length;
  const reservedCount = spots.filter(s => s.status.trim().toLowerCase() === "reserved").length;

  const indexOfLastSpot = currentPage * spotsPerPage;
  const indexOfFirstSpot = indexOfLastSpot - spotsPerPage;
  const currentSpots = filteredSpots.slice(indexOfFirstSpot, indexOfLastSpot);
  const totalPages = Math.ceil(filteredSpots.length / spotsPerPage);

  if (!garage) return <div className="text-center mt-10">Loading garage details...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-2 border-[#CF0018] rounded-[20px] mt-10 shadow-md">
      <h2 className="text-3xl font-bold text-[#CF0018] mb-1">{garage.name}</h2>
      <p className="text-lg font-semibold text-gray-700 mb-4">{garage.price_per_hour} EGP/hour</p>

      {garage.image && (
        <img
          src={garage.image}
          alt={garage.name}
          className="w-full h-64 object-cover rounded-xl mb-6 border"
        />
      )}

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
          Opening: {garage.opening_hour?.slice(0, 5)} - Closing: {garage.closing_hour?.slice(0, 5)}
        </span>
      </div>

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

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <div className="w-4 h-4 rounded-full bg-green-500"></div> Available ({availableCount})
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <div className="w-4 h-4 rounded-full bg-red-500"></div> Occupied ({occupiedCount})
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div> Reserved ({reservedCount})
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "available", "occupied", "reserved"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setCurrentPage(1); // reset to first page on filter change
            }}
            className={`px-4 py-2 rounded-lg border text-sm font-semibold capitalize ${
              filter === status
                ? "bg-[#CF0018] text-white"
                : "bg-white text-[#CF0018] border-[#CF0018]"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Spot Grid */}
      <div className="bg-gray-50 border border-gray-300 p-4 rounded-xl shadow-sm mb-8">
        <h3 className="text-lg font-bold text-gray-600 mb-4">Spot Block {currentPage}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentSpots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => handleSpotSelect(spot.id)}
              disabled={spot.status.trim().toLowerCase() !== "available"}
              className={`w-full h-24 flex flex-col items-center justify-center text-white text-sm font-semibold rounded-lg transition-transform duration-200 ${
                getSpotColor(spot.status)
              } ${
                selectedSpotId === spot.id ? "ring-4 ring-blue-300" : ""
              } ${
                spot.status.trim().toLowerCase() === "available"
                  ? "hover:scale-105"
                  : "cursor-not-allowed"
              }`}
            >
              {spot.slot_number}
            </button>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mb-8">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-md border text-sm font-medium ${
              currentPage === i + 1
                ? "bg-[#CF0018] text-white"
                : "bg-white text-[#CF0018] border-[#CF0018]"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Confirm Booking */}
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

import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import backgroundImage from "../assets/images/img.jpg.jpg";

export default function NearbyGaragesMap({ darkMode }) {
  const [userLocation, setUserLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [garages, setGarages] = useState([]);
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const mapRef = useRef();
  const markerRefs = useRef({});
  const userMarkerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
  getUserLocationOnLoad();

  // ✅ Get user name from authTokens
  const username = localStorage.getItem("username");
if (username) {
  setUserName(username);
}

}, []);


  const getUserLocationOnLoad = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = { lat: latitude, lng: longitude };
        setUserLocation(coords);
        setLocation(coords);
        fetchGarages(coords.lat, coords.lng);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setErrorMessage("Location access is required to show nearby garages.");
      }
    );
  };

  const fetchGarages = async (lat, lon, query = "") => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/garages/nearby/?lat=${lat}&lon=${lon}&search=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setGarages(data);
      setErrorMessage(data.length === 0 ? "No nearby garages found." : "");
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMessage("Failed to load garages.");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery || !userLocation) return;
    await fetchGarages(userLocation.lat, userLocation.lng, searchQuery);
    setTimeout(() => {
      if (garages.length > 0) {
        const first = garages[0];
        setLocation({ lat: first.latitude, lng: first.longitude });
        mapRef.current?.flyTo([first.latitude, first.longitude], 14);
        const marker = markerRefs.current[first.id];
        if (marker) marker.openPopup();
      } else {
        setErrorMessage("No garages found for this place.");
      }
    }, 200);
  };

  const handleUseMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = { lat: latitude, lng: longitude };
        setUserLocation(coords);
        setLocation(coords);
        fetchGarages(latitude, longitude);
        mapRef.current?.flyTo([latitude, longitude], 14);
        setTimeout(() => {
          if (userMarkerRef.current) userMarkerRef.current.openPopup();
        }, 500);
        document.querySelector("#map-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      },
      (err) => {
        console.error("Error getting location", err);
        setErrorMessage("Location access is needed to find nearby garages.");
      }
    );
  };

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
        if (userLocation) fetchGarages(userLocation.lat, userLocation.lng);
        mapRef.current?.flyTo([lat, lng], 14);
      },
    });
    return null;
  }

  const wrapperClasses = `flex flex-col items-center min-h-screen px-4 py-6 overflow-x-hidden ${
    darkMode ? "bg-gray-900 text-white" : "text-black"
  } bg-cover bg-center`;

  const mapHeight =
    typeof window !== "undefined" && window.innerWidth < 768 ? "40vh" : "50vh";
    

  return (
    <div
      className={wrapperClasses}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      
      {/* ✅ Welcome Message */}
      {userName && (
  <div className="bg-white/10 backdrop-blur-md text-center text-white px-6 py-4 rounded-xl shadow-md mb-6 w-full max-w-xl">
    <h2 className="text-4xl font-bold mb-2">
      👋 Welcome back,
    </h2>
    <p className="text-2xl font-semibold text-green-400">
      {userName}!
    </p>
  </div>
)}

    
      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-2 mb-4 w-full max-w-4xl">
        <input
          type="text"
          placeholder="Search for a place"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`px-3 py-2 rounded border w-56 text-sm ${
            darkMode
              ? "bg-gray-700 text-white border-gray-500"
              : "bg-white border-gray-300"
          }`}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
        >
          Search
        </button>
        <button
          onClick={handleUseMyLocation}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
        >
          📍 Use My Location
        </button>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="text-red-500 font-semibold mb-4">{errorMessage}</div>
      )}

      {/* Map */}
      <div
        id="map-section"
        className="w-full max-w-6xl mb-6 rounded shadow-md overflow-hidden"
      >
        <MapContainer
          center={location ? [location.lat, location.lng] : [30.05, 31.23]}
          zoom={13}
          style={{ height: mapHeight }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler />
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              ref={userMarkerRef}
            >
              <Popup>📍 You are here</Popup>
            </Marker>
          )}
          {garages.map((garage) => (
            <Marker
              key={garage.id}
              position={[garage.latitude, garage.longitude]}
              ref={(ref) => (markerRefs.current[garage.id] = ref)}
            >
              <Popup>
                <strong>{garage.name}</strong>
                <br />
                {garage.address}
                <br />
                Lat: {garage.latitude.toFixed(4)}
                <br />
                Lng: {garage.longitude.toFixed(4)}
                <br />
                Distance: {garage.distance?.toFixed(2)} km
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {/* Garage Cards */}

<div className="flex flex-wrap lg:flex-nowrap justify-center gap-6 w-full px-4 max-w-6xl overflow-x-auto">
  {(searchQuery.trim()
    ? garages.filter((garage) =>
        garage.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : garages
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5)
  ).map((garage) => (
    <div
      key={garage.id}
className="rounded-xl shadow-lg p-4 w-72 h-[260px] flex-shrink-0 hover:scale-105 transform transition duration-300 cursor-pointer relative bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white"
    >
      <h3 className="text-lg font-bold mb-1">{garage.name}</h3>
      <p className="text-sm opacity-80 mb-1">{garage.address}</p>
      <p className="text-sm opacity-80 mb-1">
        <strong>Lat:</strong> {garage.latitude.toFixed(4)}
      </p>
      <p className="text-sm opacity-80 mb-1">
        <strong>Lng:</strong> {garage.longitude.toFixed(4)}
      </p>
      <p className="text-sm font-semibold mb-2">
        Distance: {garage.distance?.toFixed(2)} km
      </p>

      <div
        className={`rounded-md px-2 py-1 text-center text-xs font-semibold mb-2 ${
          garage.available_spots === 0
            ? "bg-red-600 text-white"
            : "bg-green-600 text-white"
        }`}
      >
        {garage.available_spots === 0
          ? "🚫 No available spots"
          : `✅ ${garage.available_spots} spot(s) available`}
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
        <button
          onClick={() => {
            mapRef.current?.setView([garage.latitude, garage.longitude], 16);
            markerRefs.current[garage.id]?.openPopup();
            document.querySelector("#map-section")?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-3 py-1 flex-1 text-sm"
        >
          View
        </button>
        <button
          onClick={() => navigate(`/garages/${garage.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1 flex-1 text-sm"
        >
          Details
        </button>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}
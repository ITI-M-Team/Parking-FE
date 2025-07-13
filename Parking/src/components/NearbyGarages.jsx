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

export default function NearbyGaragesMap({ darkMode, setDarkMode }) {
  const [userLocation, setUserLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [garages, setGarages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const mapRef = useRef();
  const markerRefs = useRef({});
  const userMarkerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    getUserLocationOnLoad();
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
        `http://localhost:8000/api/garages/nearby/?lat=${lat}&lon=${lon}&search=${encodeURIComponent(
          query
        )}`
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

        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 14);
        }

        setTimeout(() => {
          if (userMarkerRef.current) {
            userMarkerRef.current.openPopup();
          }
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
        if (userLocation) {
          fetchGarages(userLocation.lat, userLocation.lng);
        }
        mapRef.current?.flyTo([lat, lng], 14);
      },
    });
    return null;
  }

  const styles = darkMode ? darkStyles : lightStyles;

  return (
    <div style={styles.wrapper}>
      {/* <button onClick={() => setDarkMode(!darkMode)} style={styles.darkModeToggle}>
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button> */}

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search for a place"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
        <button onClick={handleUseMyLocation} style={styles.button}>
          📍 Use My Location
        </button>
      </div>

      {errorMessage && <div style={styles.error}>{errorMessage}</div>}

      <div id="map-section" style={styles.mapContainer}>
        <MapContainer
          center={location ? [location.lat, location.lng] : [30.05, 31.23]}
          zoom={13}
          style={styles.map}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler />

          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} ref={userMarkerRef}>
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

      <div style={styles.cardContainer}>
        {[...garages]
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5)
          .map((garage) => (
            <div
              key={garage.id}
              style={{
                background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
                width: "340px",
                height: "280px",
                borderRadius: "20px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.7)",
                color: "white",
                padding: "20px",
                marginBottom: "20px",
                position: "relative",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3
                style={{
                  marginBottom: "8px",
                  fontSize: "22px",
                  fontFamily: "'Fira Code', monospace",
                }}
              >
                {garage.name}
              </h3>
              <p style={{ fontSize: "14px", marginBottom: "4px", opacity: 0.8 }}>
                {garage.address}
              </p>
              <p style={{ fontSize: "14px", marginBottom: "4px", opacity: 0.8 }}>
                <strong>Latitude:</strong> {garage.latitude.toFixed(4)}
              </p>
              <p style={{ fontSize: "14px", marginBottom: "4px", opacity: 0.8 }}>
                <strong>Longitude:</strong> {garage.longitude.toFixed(4)}
              </p>
              <p style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "50px" }}>
                Distance: {garage.distance?.toFixed(2)} km
              </p>
              <div style={{ display: "flex", gap: "10px", position: "absolute", bottom: "20px", left: "20px", right: "20px" }}>
                <button
                  style={{
                    backgroundColor: "#FF8C42",
                    border: "none",
                    borderRadius: "12px",
                    padding: "8px 16px",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    flex: 1,
                    transition: "background-color 0.3s ease",
                  }}
                  onClick={() => {
                    if (mapRef.current) {
                      mapRef.current.setView([garage.latitude, garage.longitude], 16);
                    }
                    const marker = markerRefs.current[garage.id];
                    if (marker) {
                      marker.openPopup();
                    }
                    document.querySelector("#map-section")?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e57a32")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF8C42")}
                >
                  View on Map
                </button>
                <button
                  style={{
                    backgroundColor: "#007bff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "8px 16px",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    flex: 1,
                    transition: "background-color 0.3s ease",
                  }}
                  onClick={() => navigate(`/garages/${garage.id}`)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
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

const baseStyles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    position: "relative",
  },
  controls: {
    marginBottom: "15px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
    width: "250px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 16px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  mapContainer: {
    width: "90%",
    maxWidth: "1000px",
    height: "80vh",
    marginBottom: "30px",
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    padding: "0 20px",
    width: "100%",
  },
};

const lightStyles = {
  ...baseStyles,
  wrapper: {
    ...baseStyles.wrapper,
   
    color: "#000",
  },
};

const darkStyles = {
  ...baseStyles,
  wrapper: {
    ...baseStyles.wrapper,
    backgroundColor: "rgb(31,41,55)",
    color: "#fff",
  },
  input: {
    ...baseStyles.input,
    backgroundColor: "#333",
    color: "#fff",
    border: "1px solid #666",
  },
  button: {
    ...baseStyles.button,
    backgroundColor: "#666",
  },
};

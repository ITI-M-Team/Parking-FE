import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function NearbyGaragesMap() {
  const [userLocation, setUserLocation] = useState(null); // 🧭 موقعك الحقيقي
  const [location, setLocation] = useState(null);         // 📍 مركز الخريطة فقط
  const [searchQuery, setSearchQuery] = useState('');
  const [garages, setGarages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const mapRef = useRef();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = { lat: latitude, lng: longitude };
        setUserLocation(coords);
        setLocation(coords);
        fetchGarages(coords.lat, coords.lng);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setErrorMessage('Location access is required to show nearby garages.');
      }
    );
  }, []);

  const fetchGarages = async (lat, lon, query = '') => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/garages/nearby/?lat=${lat}&lon=${lon}&search=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setGarages(data);
      setErrorMessage(data.length === 0 ? 'No nearby garages found.' : '');
    } catch (err) {
      console.error('Fetch error:', err);
      setErrorMessage('Failed to load garages.');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery || !userLocation) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
      );
      const data = await res.json();
      if (data.length === 0) {
        setErrorMessage('Place not found.');
        return;
      }
      const { lat, lon } = data[0];
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      setLocation({ lat: latNum, lng: lonNum }); // تغيير مركز الماب
      fetchGarages(userLocation.lat, userLocation.lng, searchQuery); // 👈 نستخدم موقعك الحقيقي
      mapRef.current?.flyTo([latNum, lonNum], 14);
    } catch (err) {
      console.error('Search error:', err);
      setErrorMessage('Search failed.');
    }
  };

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng }); // تغيير المركز فقط
        if (userLocation) {
          fetchGarages(userLocation.lat, userLocation.lng); // 👈 نحسب من موقعك الثابت
        }
        mapRef.current?.flyTo([lat, lng], 14);
      },
    });
    return null;
  }

  const styles = darkMode ? darkStyles : lightStyles;

  return (
    <div style={styles.wrapper}>
      {/* Dark Mode Toggle */}
      <button onClick={() => setDarkMode(!darkMode)} style={styles.darkModeToggle}>
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search for a place"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>Search</button>
      </div>

      {errorMessage && <div style={styles.error}>{errorMessage}</div>}

      <div style={styles.mapContainer}>
        <MapContainer
          center={location ? [location.lat, location.lng] : [30.05, 31.23]}
          zoom={13}
          style={styles.map}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler />

          {location && (
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                <strong>Your View</strong><br />
                Lat: {location.lat.toFixed(4)}<br />
                Lng: {location.lng.toFixed(4)}
              </Popup>
            </Marker>
          )}

          {garages.map((garage) => (
            <Marker
              key={garage.id}
              position={[garage.latitude, garage.longitude]}
            >
              <Popup>
                <strong>Garage Location</strong><br />
                Lat: {garage.latitude.toFixed(4)}<br />
                Lng: {garage.longitude.toFixed(4)}<br />
                Distance: {garage.distance.toFixed(2)} km
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

const baseStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    position: 'relative',
  },
  darkModeToggle: {
    position: 'absolute',
    top: '15px',
    right: '20px',
    padding: '8px 14px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#555',
    color: 'white',
    cursor: 'pointer',
    zIndex: 1000,
  },
  controls: {
    marginBottom: '15px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    width: '250px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '8px 16px',
    fontSize: '16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  mapContainer: {
    width: '90%',
    maxWidth: '1000px',
    height: '80vh',
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
  },
};

const lightStyles = {
  ...baseStyles,
  wrapper: {
    ...baseStyles.wrapper,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
};

const darkStyles = {
  ...baseStyles,
  wrapper: {
    ...baseStyles.wrapper,
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  input: {
    ...baseStyles.input,
    backgroundColor: '#333',
    color: '#fff',
    border: '1px solid #666',
  },
  button: {
    ...baseStyles.button,
    backgroundColor: '#666',
  },
};

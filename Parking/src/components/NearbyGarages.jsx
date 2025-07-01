import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function NearbyGaragesMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [garages, setGarages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const mapRef = useRef();
  const markerRefs = useRef({});
  const userMarkerRef = useRef();

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
        console.error('Geolocation error:', err);
        setErrorMessage('Location access is required to show nearby garages.');
      }
    );
  };

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

  await fetchGarages(userLocation.lat, userLocation.lng, searchQuery);

  setTimeout(() => {
    if (garages.length > 0) {
      const first = garages[0];
      setLocation({ lat: first.latitude, lng: first.longitude });
      mapRef.current?.flyTo([first.latitude, first.longitude], 14);

      const marker = markerRefs.current[first.id];
      if (marker) marker.openPopup();
    } else {
      setErrorMessage('No garages found for this place.');
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

        document.querySelector('#map-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      },
      (err) => {
        console.error('Error getting location', err);
        setErrorMessage('Location access is needed to find nearby garages.');
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
        <button onClick={handleUseMyLocation} style={styles.button}>📍 Use My Location</button>
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
                <strong>{garage.name}</strong><br />
                {garage.address}<br />
                Lat: {garage.latitude.toFixed(4)}<br />
                Lng: {garage.longitude.toFixed(4)}<br />
                Distance: {garage.distance?.toFixed(2)} km
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Show only the 5 nearest garages */}
      <div style={styles.cardContainer}>
        {[...garages]
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5)
          .map((garage) => (
            <div key={garage.id} style={styles.card}>
              <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>{garage.name}</h3>
              <p style={styles.cardInfo}>{garage.address}</p>
              <p style={styles.cardInfo}><strong>Rate:</strong> {garage.hourly_rate} EGP/hour</p>
              <p style={styles.cardInfo}><strong>Available Spots:</strong> {garage.available_spots}</p>
              <p style={styles.cardInfo}><strong>Rating:</strong> {garage.average_rating ?? 'N/A'}</p>
              <p style={styles.cardInfo}><strong>Distance:</strong> {garage.distance?.toFixed(2)} km</p>
              <button
                style={styles.cardButton}
                onClick={() => {
                  if (mapRef.current) {
                    mapRef.current.setView([garage.latitude, garage.longitude], 16);
                  }
                  const marker = markerRefs.current[garage.id];
                  if (marker) {
                    marker.openPopup();
                  }
                  document.querySelector('#map-section')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                }}
              >
                View on Map
              </button>
            </div>
        ))}
      </div>
    </div>
  );
}

// ----------- STYLES -----------

const baseStyles = {
  wrapper: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px', position: 'relative',
  },
  darkModeToggle: {
    position: 'absolute', top: '15px', right: '20px', padding: '8px 14px', fontSize: '16px', borderRadius: '8px', border: 'none', backgroundColor: '#555', color: 'white', cursor: 'pointer', zIndex: 1000,
  },
  controls: {
    marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center',
  },
  input: {
    padding: '8px', fontSize: '16px', width: '250px', borderRadius: '6px', border: '1px solid #ccc',
  },
  button: {
    padding: '8px 16px', fontSize: '16px', borderRadius: '6px', border: 'none', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer',
  },
  error: {
    color: 'red', fontWeight: 'bold', marginBottom: '10px',
  },
  mapContainer: {
    width: '90%', maxWidth: '1000px', height: '80vh', marginBottom: '30px',
  },
  map: {
    width: '100%', height: '100%', borderRadius: '12px', boxShadow: '0 0 10px rgba(0,0,0,0.2)',
  },
  cardContainer: {
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '0 20px', width: '100%',
  },
  card: {
    width: '280px', padding: '20px', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'left', transition: 'transform 0.2s ease',
  },
  cardInfo: {
    margin: '4px 0', fontSize: '14px', lineHeight: '1.5',
  },
  cardButton: {
    marginTop: '10px', padding: '8px 12px', border: 'none', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer',
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
  card: {
    ...baseStyles.card,
    backgroundColor: '#2c2c2c',
    color: '#fff',
  },
  cardButton: {
    ...baseStyles.cardButton,
    backgroundColor: '#888',
  },
};

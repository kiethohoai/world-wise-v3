import styles from './Map.module.css';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import useCities from '../contexts/useCities';

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([16.4642982, 107.5875636]);
  const [searchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={`city-${city.id}`}
          >
            <Popup>{city.cityName}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;

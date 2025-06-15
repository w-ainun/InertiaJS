import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});

type StoreMapProps = {
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  website: string;
  heightClass?: string;
};

const StoreMap = ({
  name,
  lat,
  lng,
  address,
  phone,
  website,
  heightClass = 'h-[500px]',
}: StoreMapProps) => {
  const position: [number, number] = [lat, lng];

  const handleLihatRute = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung Geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const gmapsURL = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${lat},${lng}`;
        window.open(gmapsURL, "_blank");
      },
      (error) => {
        alert("Gagal mendeteksi lokasi Anda.");
        console.error(error);
      }
    );
  };

return (
  <div className="w-full mt-6">
    <div className={`${heightClass} w-full rounded-lg overflow-hidden shadow-md relative`}>
      <div className="absolute top-2 left-2 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleLihatRute}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 shadow"
        >
          Lihat Rute
        </button>

        <a
          href={`https://www.google.com/maps?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-white border text-sm rounded hover:bg-gray-100 shadow"
        >
          Buka di Google Maps
        </a>
      </div>
      <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <strong>{name}</strong><br />
            {address}<br />
            Tel: {phone}<br />
            <a href={website} target="_blank" rel="noopener noreferrer">Website</a>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  </div>
);
};

export default StoreMap;
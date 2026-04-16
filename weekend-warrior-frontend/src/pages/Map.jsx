import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Map() {
  // координаты Бишкека
  const center = [42.8746, 74.5698];

  // тестовые события
  const events = [
    {
      id: 1,
      title: "Футбол ⚽",
      position: [42.87, 74.60]
    },
    {
      id: 2,
      title: "Настолки 🎲",
      position: [42.88, 74.55]
    }
  ];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        
        {/* 🗺️ слой карты */}
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 📍 метки событий */}
        {events.map(event => (
          <Marker key={event.id} position={event.position}>
            <Popup>
              <b>{event.title}</b>
              <br />
              <button
                onClick={() => window.location.href = `/event/${event.id}`}
              >
                Перейти
              </button>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}

export default Map;
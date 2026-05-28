import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { API_BASE_URL } from "../config";

function Map() {
  // центр Бишкека
  const center = [42.8746, 74.5698];

  // активности с бэка
  const [events, setEvents] = useState([]);

  // загрузка активностей
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/activities`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Ошибка загрузки активностей");
        }

        return res.json();
      })
      .then(data => {
        console.log("Активности:", data);

        // фильтруем только активности с координатами
        const mappedEvents = data
          .filter(
            event =>
              event.latitude !== null &&
              event.longitude !== null
          )
          .map(event => ({
            id: event.ID || event.id,
            title: event.title,
            description: event.description,
            latitude: event.latitude,
            longitude: event.longitude
          }));

        setEvents(mappedEvents);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        {/* 🗺️ карта */}
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 📍 активности */}
        {events.map(event => (
          <Marker
            key={event.id}
            position={[
              event.latitude,
              event.longitude
            ]}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <h3
                  style={{
                    margin: 0,
                    marginBottom: 8
                  }}
                >
                  {event.title}
                </h3>

                <p
                  style={{
                    fontSize: 14,
                    marginBottom: 10
                  }}
                >
                  {event.description}
                </p>

                <button
                  onClick={() =>
                    window.location.href = `/event/${event.id}`
                  }
                  style={{
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer"
                  }}
                >
                  Перейти
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
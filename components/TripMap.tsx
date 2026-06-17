"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon in webpack/Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

interface TripMapProps {
  destination: string;
  coords: { lat: number; lng: number };
}

function MapUpdater({ coords }: { coords: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([coords.lat, coords.lng], 11, { animate: true });
  }, [coords, map]);
  return null;
}

export default function TripMap({ destination, coords }: TripMapProps) {
  return (
    <div className="map-wrap">
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coords.lat, coords.lng]}>
          <Popup>
            <strong>{destination}</strong>
            <br />
            <small>
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </small>
          </Popup>
        </Marker>
        <MapUpdater coords={coords} />
      </MapContainer>
    </div>
  );
}

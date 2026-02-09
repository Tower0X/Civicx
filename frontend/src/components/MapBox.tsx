import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  defaultLocation?: { lat: number; lng: number; name: string };
}

// Cameroon cities coordinates
const CAMEROON_CITIES = {
  yaounde: { lat: 3.8667, lng: 11.5167, name: "Yaoundé" },
  douala: { lat: 4.0511, lng: 9.7679, name: "Douala" },
};

// Cameroon center
const CAMEROON_CENTER = { lat: 3.848, lng: 11.5021 };

// Fix Leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapComponent: React.FC<MapComponentProps> = ({
  onLocationSelect,
  defaultLocation = { lat: CAMEROON_CENTER.lat, lng: CAMEROON_CENTER.lng, name: "Cameroon" },
}) => {
  const [position, setPosition] = useState<[number, number]>([
    defaultLocation.lat,
    defaultLocation.lng,
  ]);
  const [address, setAddress] = useState<string>(defaultLocation.name);

  const handleMapClick = async (e: any) => {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);

    // Reverse geocode to get address
    const addr = await reverseGeocode(lng, lat);
    setAddress(addr);
    onLocationSelect(lat, lng, addr);
  };

  // react-leaflet way to listen to map events
  const MapClickHandler: React.FC<{ onMapClick: (e: any) => void }> = ({ onMapClick }) => {
    useMapEvents({
      click: (e) => {
        onMapClick(e);
      },
    });
    return null;
  };

  const handleMarkerDragEnd = async (e: any) => {
    const { lat, lng } = e.target.getLatLng();
    setPosition([lat, lng]);

    // Reverse geocode to get address
    const addr = await reverseGeocode(lng, lat);
    setAddress(addr);
    onLocationSelect(lat, lng, addr);
  };

  async function reverseGeocode(lng: number, lat: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return data.address?.name || data.address?.city || data.address?.town || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }

  return (
    <MapContainer center={position} zoom={defaultLocation.name === "Cameroon" ? 6 : 13} style={{ width: "100%", height: "100%" }}>
      <MapClickHandler onMapClick={handleMapClick} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} draggable={true} eventHandlers={{ dragend: handleMarkerDragEnd }}>
        <Popup>{address}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
export { CAMEROON_CITIES };

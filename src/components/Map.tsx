import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center: [number, number];
  zoom: number;
}

const Map: React.FC<MapProps> = ({ center, zoom }) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center}>
        <Popup>
          A sample popup.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;

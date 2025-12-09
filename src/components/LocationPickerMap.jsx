import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Íconos personalizados (los mismos que en MapView)
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const lostIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const foundIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const adoptionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Componente para manejar los eventos del mapa
function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function LocationPickerMap({ userLocation, onLocationSelect, onCancel, petStatus }) {
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handleMapClick = (latlng) => {
    setSelectedPosition(latlng);
  };

  const handleConfirm = () => {
    if (selectedPosition) {
      onLocationSelect(selectedPosition);
    }
  };

  const initialCenter = userLocation ? [userLocation.lat, userLocation.lng] : [-33.45, -70.66];

  // Seleccionar el ícono basado en el estado de la mascota
  const getReportIcon = () => {
    switch (petStatus) {
      case 'lost':
        return lostIcon;
      case 'found':
        return foundIcon;
      case 'available_for_adoption':
        return adoptionIcon;
      default:
        return lostIcon; // Un color por defecto
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Selecciona la ubicación en el mapa</h3>
          <p className="text-sm text-gray-600">Haz clic en el mapa para colocar el marcador del reporte.</p>
        </div>
        <div className="flex-grow relative">
          <MapContainer center={initialCenter} zoom={14} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            
            <MapEvents onMapClick={handleMapClick} />

            {/* Marcador de la ubicación del usuario (referencia) */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>Tu ubicación actual (referencia)</Popup>
              </Marker>
            )}

            {/* Marcador de la ubicación seleccionada para el reporte */}
            {selectedPosition && (
              <Marker position={selectedPosition} icon={getReportIcon()}>
                <Popup>Ubicación del reporte</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        <div className="p-4 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedPosition}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Confirmar Ubicación
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationPickerMap;
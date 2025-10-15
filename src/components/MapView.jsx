import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ImageModal from "./ImageModal";

// Íconos personalizados
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
});

const foundIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Componente para controlar el centrado del mapa
function RecenterMap({ center }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

// Componente del botón de centrar ubicación
function CenterLocationButton({ userLocation, onCenter }) {
  if (!userLocation) return null;

  return (
    <button
      onClick={onCenter}
      className="absolute top-4 right-4 w-12 h-12 bg-white hover:bg-gray-100 text-gray-700 rounded-full shadow-lg flex items-center justify-center transition-colors z-[1000] border border-gray-200"
      title="Centrar en mi ubicación"
    >
      <i className="fas fa-location-crosshairs text-lg"></i>
    </button>
  );
}

function MapView({ center, pets, userLocation, onCenterLocation }) {
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);
  const mapRef = useRef();

  const openModal = (images, idx) => {
    setModalImages(images);
    setModalIndex(idx);
  };

  const closeModal = () => {
    setModalImages([]);
    setModalIndex(null);
  };

  const prevImg = () => {
    setModalIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1));
  };

  const nextImg = () => {
    setModalIndex((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1));
  };

  const handleCenterLocation = () => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      if (onCenterLocation) {
        onCenterLocation(userLocation);
      }
    }
  };

  return (
    <>
      <MapContainer 
  center={mapCenter} 
  zoom={13} 
  style={{ height: "100%", width: "100%" }}
  ref={mapRef}
>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterMap center={mapCenter} />
        
        {pets.map((pet) => (
          <Marker
            key={pet.id}
            position={[pet.lat, pet.lng]}
            icon={pet.status === "lost" ? lostIcon : foundIcon}
          >
            <Popup>
              <div style={{ minWidth: 220 }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
                  {pet.images && pet.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={pet.name}
                      style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", cursor: "pointer" }}
                      onClick={() => openModal(pet.images, idx)}
                    />
                  ))}
                </div>
                <strong>{pet.name}</strong>
                <p style={{ fontSize: "0.95em" }}>{pet.description}</p>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${pet.status === "lost" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {pet.status === "lost" ? "Perdido" : "Encontrado"}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
          >
            <Popup>Tu ubicación actual</Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Botón para centrar ubicación */}
      <CenterLocationButton 
        userLocation={userLocation} 
        onCenter={handleCenterLocation}
      />
      
      <ImageModal
        images={modalImages}
        current={modalIndex}
        onClose={closeModal}
        onPrev={prevImg}
        onNext={nextImg}
      />
    </>
  );
}

export default MapView;
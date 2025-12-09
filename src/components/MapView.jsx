import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ImageModal from "./ImageModal";
import { getImageUrl } from "../utils/imageHelper"; // Asegúrate de importar esto

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

const adoptionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
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

function MapView({ center, pets, userLocation, onCenterLocation, onStartChat }) {
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);
  const mapRef = useRef();

  const openModal = (images, idx) => {
    console.log('Abriendo modal con imágenes:', images);
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

  const getPetIcon = (status) => {
    switch (status) {
      case "lost":
        return lostIcon;
      case "found":
        return foundIcon;
      case "available_for_adoption":
        return adoptionIcon;
      default:
        return lostIcon;
    }
  };

  const getPetStatusInfo = (status) => {
    switch (status) {
      case "lost":
        return { text: "Perdido", className: "bg-red-100 text-red-700" };
      case "found":
        return { text: "Encontrado", className: "bg-green-100 text-green-700" };
      case "available_for_adoption":
        return { text: "En Adopción", className: "bg-orange-100 text-orange-700" };
      default:
        return { text: "Desconocido", className: "bg-gray-100 text-gray-700" };
    }
  };

  // Filtrar mascotas con coordenadas válidas
  const validPets = pets.filter(pet => {
    if (!pet.lat || !pet.lng) {
      console.warn('Mascota sin coordenadas válidas:', pet);
      return false;
    }
    return true;
  });

  console.log('Mascotas válidas para mostrar en mapa:', validPets.length);

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
        
        {validPets.map((pet) => {
          const statusInfo = getPetStatusInfo(pet.status);
          
          // Obtener URLs completas de todas las imágenes usando imageHelper
          const imageUrls = pet.images ? pet.images.map(img => getImageUrl(img)) : [];
          
          console.log(`Mascota "${pet.name || 'Sin nombre'}":`, {
            images: pet.images,
            imageUrls: imageUrls,
            hasImages: imageUrls.length > 0
          });
          
          return (
            <Marker
              key={pet.id}
              position={[pet.lat, pet.lng]}
              icon={getPetIcon(pet.status)}
            >
              <Popup>
                <div style={{ minWidth: 220, maxWidth: 300 }}>
                  {imageUrls.length > 0 ? (
                    <div style={{ display: "flex", gap: "4px", marginBottom: "8px", overflowX: "auto" }}>
                      {imageUrls.map((imgUrl, idx) => {
                        console.log(`Mostrando imagen ${idx}: ${imgUrl}`);
                        return (
                          <img
                            key={idx}
                            src={imgUrl}
                            alt={pet.name || `Mascota ${idx + 1}`}
                            style={{ 
                              width: "60px", 
                              height: "60px", 
                              objectFit: "cover", 
                              borderRadius: "6px", 
                              cursor: "pointer",
                              border: "1px solid #ddd"
                            }}
                            onClick={() => openModal(imageUrls, idx)}
                            onError={(e) => {
                              console.error('❌ Error cargando imagen en popup:', imgUrl);
                              e.target.src = 'https://via.placeholder.com/60x60/cccccc/666666?text=Imagen+no+disponible';
                            }}
                            onLoad={() => console.log(`✅ Imagen cargada: ${imgUrl}`)}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ marginBottom: "8px", textAlign: "center", color: "#666" }}>
                      <i className="fas fa-image" style={{ fontSize: "24px", marginBottom: "4px" }}></i>
                      <div>Sin imágenes</div>
                    </div>
                  )}
                  
                  <strong style={{ fontSize: "16px", display: "block", marginBottom: "4px" }}>
                    {pet.name || "Sin nombre"}
                  </strong>
                  
                  {pet.description && (
                    <p style={{ fontSize: "0.95em", margin: "8px 0", color: "#444" }}>
                      {pet.description.length > 100 ? `${pet.description.substring(0, 100)}...` : pet.description}
                    </p>
                  )}
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                    <span 
                      style={{ 
                        padding: "2px 8px", 
                        borderRadius: "12px", 
                        fontSize: "0.8em", 
                        fontWeight: "bold",
                        backgroundColor: statusInfo.className.includes('red') ? "#fee2e2" : 
                                      statusInfo.className.includes('green') ? "#dcfce7" : 
                                      statusInfo.className.includes('orange') ? "#ffedd5" : "#f3f4f6",
                        color: statusInfo.className.includes('red') ? "#dc2626" : 
                               statusInfo.className.includes('green') ? "#16a34a" : 
                               statusInfo.className.includes('orange') ? "#ea580c" : "#374151"
                      }}
                    >
                      {statusInfo.text}
                    </span>
                    
                    {pet.species && (
                      <span style={{ fontSize: "0.8em", color: "#666" }}>
                        <i className="fas fa-paw mr-1"></i>
                        {pet.species === 'dog' ? 'Perro' : 
                         pet.species === 'cat' ? 'Gato' : 
                         pet.species === 'bird' ? 'Ave' : 
                         pet.species === 'rabbit' ? 'Conejo' : 'Otro'}
                      </span>
                    )}
                  </div>
                  
                  {pet.user && pet.user.name && (
                    <div style={{ marginTop: "8px", fontSize: "0.8em", color: "#666", borderTop: "1px solid #eee", paddingTop: "8px" }}>
                      Publicado por: <strong>{pet.user.name}</strong>
                    </div>
                  )}
                  
                  <button
                    onClick={() => onStartChat && onStartChat(pet.user || { name: "Usuario" })}
                    style={{
                      marginTop: "12px",
                      padding: "6px 12px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.85em",
                      cursor: "pointer",
                      width: "100%"
                    }}
                  >
                    <i className="fas fa-comment-dots mr-1"></i>
                    Contactar
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
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
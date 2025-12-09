import React, { useState } from "react";
import ImageModal from "./ImageModal";
import { getImageUrl, getPlaceholderImage } from "../utils/imageHelper";

function PetCard({ pet, onStartChat }) {
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(null);

  const openModal = (images, idx) => {
    console.log('Abriendo modal en PetCard con imágenes:', images);
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

  const getStatusInfo = (status) => {
    switch (status) {
      case "lost":
        return { text: "Perdido", className: "bg-red-100 text-red-700" };
      case "found":
        return { text: "Encontrado", className: "bg-green-100 text-green-700" };
      case "available_for_adoption":
        return { text: "En Adopción", className: "bg-orange-100 text-orange-700" };
      default:
        return { text: status, className: "bg-gray-100 text-gray-700" };
    }
  };

  const statusInfo = getStatusInfo(pet.status);

  // Obtener URLs completas para todas las imágenes usando imageHelper
  const imageUrls = pet.images ? pet.images.map(img => {
    const url = getImageUrl(img);
    console.log(`PetCard - Imagen convertida: ${img} -> ${url}`);
    return url;
  }) : [];

  console.log(`PetCard "${pet.name || 'Sin nombre'}":`, {
    images: pet.images,
    imageUrls: imageUrls
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3 border border-gray-200">
      <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
        {imageUrls.length > 0 ? (
          imageUrls.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={pet.name || `Mascota ${idx + 1}`}
              className="w-20 h-20 object-cover rounded-md border cursor-pointer hover:scale-105 transition flex-shrink-0"
              onClick={() => openModal(imageUrls, idx)}
              onError={(e) => {
                console.error('❌ Error cargando imagen en PetCard:', imgUrl);
                e.target.src = getPlaceholderImage('Imagen no disponible');
              }}
              onLoad={() => console.log(`✅ Imagen cargada en PetCard: ${imgUrl}`)}
            />
          ))
        ) : (
          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-md border">
            <i className="fas fa-image text-gray-400 text-xl"></i>
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-800">{pet.name || "Sin nombre"}</h3>
        <p className="text-sm text-gray-600 mt-1">{pet.description}</p>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusInfo.className}`}>
          {statusInfo.text}
        </span>
        <p className="text-xs text-gray-500">
          Publicado por: <span className="font-medium">{pet.user?.name || "Usuario"}</span>
        </p>
      </div>
      <div className="border-t border-gray-200 mt-3 pt-3 flex gap-2">
        <button 
          onClick={() => onStartChat(pet.user || { name: "Usuario" })}
          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <i className="fas fa-comment-dots"></i>
          Contactar
        </button>
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <i className="fas fa-share-alt"></i>
          Compartir
        </button>
      </div>

      <ImageModal
        images={imageUrls}
        current={modalIndex}
        onClose={closeModal}
        onPrev={prevImg}
        onNext={nextImg}
      />
    </div>
  );
}

export default PetCard;
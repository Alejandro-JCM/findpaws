import React, { useState } from "react";
import ImageModal from "./ImageModal";

function PetCard({ pet, mode }) {
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(null);

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

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3 border border-gray-200">
      <div className="flex gap-2 mb-2">
        {pet.images && pet.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={pet.name}
            className="w-20 h-20 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
            onClick={() => openModal(pet.images, idx)}
          />
        ))}
      </div>
      <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
      <p className="text-sm text-gray-600">{pet.description}</p>
      <div className="mt-2">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          pet.status === "lost"
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }`}>
          {pet.status === "lost" ? "Perdido" : "Encontrado"}
        </span>
      </div>
      <ImageModal
        images={modalImages}
        current={modalIndex}
        onClose={closeModal}
        onPrev={prevImg}
        onNext={nextImg}
      />
    </div>
  );
}

export default PetCard;
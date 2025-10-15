import React from "react";

function ImageModal({ images, current, onClose, onPrev, onNext }) {
  if (!images || images.length === 0 || current === null) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
      <button
        onClick={onClose}
        className="absolute top-6 right-8 bg-white bg-opacity-80 rounded-full p-2 text-gray-700 hover:bg-opacity-100 z-10"
      >
        <i className="fas fa-times text-lg"></i>
      </button>
      <button
        onClick={onPrev}
        className="absolute left-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 text-gray-700 hover:bg-opacity-100 z-10"
        style={{ fontSize: 24 }}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <img
        src={images[current]}
        alt="Mascota"
        className="max-w-full max-h-[80vh] rounded-lg shadow-lg"
        style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.5)" }}
      />
      <button
        onClick={onNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 text-gray-700 hover:bg-opacity-100 z-10"
        style={{ fontSize: 24 }}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
}

export default ImageModal;
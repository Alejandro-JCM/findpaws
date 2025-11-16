import React from "react";

function AlertModal({ message, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 10001 }} // Un z-index más alto que el LoginModal
    >
      <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-2xl border border-gray-200 text-center">
        <p className="text-gray-800 mb-6 text-lg">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2 rounded-lg"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default AlertModal;
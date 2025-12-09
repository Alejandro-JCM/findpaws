import React from "react";

function AlertModal({ message, onClose, onConfirm, showCancel = false }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 10001 }}
    >
      <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-2xl border border-gray-200 text-center">
        <div className="mb-4">
          <i className="fas fa-exclamation-circle text-2xl text-yellow-500"></i>
        </div>
        
        <p className="text-gray-800 mb-6 text-lg">{message}</p>
        
        <div className="flex gap-3 justify-center">
          {showCancel && (
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
          
          <button
            onClick={onConfirm || onClose}
            className={`px-6 py-2 text-white font-bold rounded-lg ${
              showCancel 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {showCancel ? "Sí, eliminar" : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
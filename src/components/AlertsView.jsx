import React from "react";

function AlertsView() {
  return (
    <div className="flex-1 bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Alertas</h2>
        <div className="text-center py-12">
          <i className="fas fa-bell text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No hay alertas
          </h3>
          <p className="text-gray-500">
            Se te notificarán potenciales coincidencias acá
          </p>
        </div>
      </div>
    </div>
  );
}

export default AlertsView;
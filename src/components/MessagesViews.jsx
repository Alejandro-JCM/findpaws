import React from "react";

function MessagesView({ user, onBack }) {
  // Si se pasa un usuario, muestra la vista de chat individual
  if (user) {
    return (
      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* Header del Chat */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-gray-500"></i>
          </div>
          <h2 className="text-lg font-bold text-gray-800">{user.name}</h2>
        </div>

        {/* Cuerpo del Chat (simulado) */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {/* Mensaje recibido */}
            <div className="flex items-end gap-2">
              <div className="bg-white p-3 rounded-lg rounded-bl-none shadow-sm max-w-xs">
                <p className="text-sm text-gray-800">
                  ¡Hola! Vi tu publicación sobre la mascota. ¿Sigue disponible?
                </p>
              </div>
            </div>
            {/* Mensaje enviado */}
            <div className="flex items-end gap-2 justify-end">
              <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-none shadow-sm max-w-xs">
                <p className="text-sm">
                  ¡Hola! Sí, aún está con nosotros. ¿Te gustaría coordinar una visita?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Input para escribir mensaje */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista por defecto si no hay un chat activo
  return (
    <div className="flex-1 bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mensajes</h2>
        <div className="text-center py-12">
          <i className="fas fa-comments text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Sin mensajes aún
          </h3>
          <p className="text-gray-500">Tus conversaciones se verán acá. Selecciona "Contactar" en una publicación para iniciar un chat.</p>
        </div>
      </div>
    </div>
  );
}

export default MessagesView;

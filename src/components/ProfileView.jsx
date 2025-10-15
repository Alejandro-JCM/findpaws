import React from "react";

function ProfileView() {
  return (
    <div className="flex-1 bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Perfil</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <i className="fas fa-user text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ¡Bienvenido a FindPaws!
            </h3>
            <p className="text-gray-600 mb-4">
              Registrate para adoptar, reportar mascotas perdidas o encontradas
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Regístrate / Inicia sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
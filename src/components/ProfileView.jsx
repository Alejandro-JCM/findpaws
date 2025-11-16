import React from "react";
import { useAuth } from "./AuthContext.jsx";

function ProfileView({ onLoginClick }) {
  const { isAuthenticated, user, logout } = useAuth();

  // Vista para usuarios autenticados
  if (isAuthenticated && user) {
    return (
      <div className="flex-1 bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              {/* Foto de Perfil */}
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center ring-4 ring-blue-100">
                  <i className="fas fa-user text-4xl text-gray-400"></i>
                </div>
                <button className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  <i className="fas fa-camera text-sm"></i>
                </button>
              </div>
              {/* Información de Usuario y Acciones */}
              <div className="flex-grow text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
              <div className="flex gap-2">
                 <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg">Editar Perfil</button>
                 <button onClick={logout} className="text-sm bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Sección de Registros del Usuario */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Mis Registros</h3>
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-paw text-3xl mb-2"></i>
                <p>Aún no has reportado ninguna mascota.</p>
                <p>¡Cuando lo hagas, aparecerán aquí!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista para usuarios no autenticados (la que ya tenías)
  return (
    <div className="flex-1 bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Perfil</h2>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="fas fa-user text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Bienvenido a FindPaws!</h3>
          <p className="text-gray-600 mb-4">Regístrate para adoptar, reportar mascotas perdidas o encontradas.</p>
          <button onClick={onLoginClick} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Regístrate / Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
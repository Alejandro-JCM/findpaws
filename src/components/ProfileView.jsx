import React, { useState } from 'react';
import { useAuth } from "./AuthContext.jsx";
import UserPetReports from "./UserPetReports.jsx";

function ProfileView({ onLoginClick }) {
  const { isAuthenticated, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' o 'reports'

  if (isAuthenticated && user) {
    return (
      <div className="flex-1 bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              {/* Foto de Perfil */}
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center ring-4 ring-blue-100">
                  <i className="fas fa-user text-4xl text-gray-400"></i>
                </div>
              </div>
              
              {/* Información de Usuario y Acciones */}
              <div className="flex-grow text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Miembro desde {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={logout} 
                  className="text-sm bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Pestañas de navegación */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex gap-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <i className="fas fa-user-circle mr-2"></i>
                  Perfil
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'reports'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <i className="fas fa-paw mr-2"></i>
                  Mis Reportes
                </button>
              </nav>
            </div>

            {/* Contenido según pestaña activa */}
            {activeTab === 'profile' ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Información del Perfil</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                        {user.name}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID de Usuario
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono text-gray-600 overflow-x-auto">
                      {user._id || user.id}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Configuración de cuenta</h4>
                    <div className="space-y-3">
                      <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex items-center justify-between transition-colors">
                        <span className="font-medium">Cambiar contraseña</span>
                        <i className="fas fa-chevron-right"></i>
                      </button>
                      
                      <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg flex items-center justify-between transition-colors">
                        <span className="font-medium">Configuración de notificaciones</span>
                        <i className="fas fa-chevron-right"></i>
                      </button>
                      
                      <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg flex items-center justify-between transition-colors">
                        <span className="font-medium">Privacidad y seguridad</span>
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mis Reportes de Mascotas</h3>
                <UserPetReports />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista para usuarios no autenticados
  return (
    <div className="flex-1 bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Perfil</h2>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="fas fa-user text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Bienvenido a FindPaws!</h3>
          <p className="text-gray-600 mb-4">Regístrate para adoptar, reportar mascotas perdidas o encontradas, y gestionar tus reportes.</p>
          <button 
            onClick={onLoginClick} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <i className="fas fa-user-plus"></i>
            Regístrate / Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
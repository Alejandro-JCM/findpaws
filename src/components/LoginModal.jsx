import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";

function LoginModal({ onClose }) {
  // Estado para alternar entre vista de Login y Registro
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Estados para los campos del formulario
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Traemos las funciones y estados del AuthContext
  const { login, register, loading, error, setError } = useAuth();

  // Limpia los errores cuando el modal se desmonta o cambia de modo
  useEffect(() => {
    return () => {
      setError('');
    };
  }, [isRegisterMode, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpia errores previos

    if (isRegisterMode) {
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }
      const success = await register(username, email, password);
      if (success) {
        onClose(); // Cierra el modal si el registro es exitoso
      }
    } else {
      const success = await login(email, password);
      if (success) {
        onClose(); // Cierra el modal si el login es exitoso
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 10000 }} // z-index alto para estar sobre todo
    >
      <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isRegisterMode ? "Crear Cuenta" : "Iniciar Sesión"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Muestra el mensaje de error si existe */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isRegisterMode ? "new-password" : "current-password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:bg-blue-300">
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : isRegisterMode ? (
              "Registrarse"
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          {isRegisterMode ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="font-medium text-blue-600 hover:underline"
          >
            {isRegisterMode ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Al cargar la app, intenta obtener los datos del usuario si hay un token
  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfoFromStorage) {
      setUser(userInfoFromStorage);
    }
    setLoading(false); // Marcar la carga como finalizada, haya o no usuario.
  }, []);

  // Función para registrar un nuevo usuario
  const register = async (username, email, password) => {
    setLoading(true);
    setError('');
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(
        'http://localhost:5001/api/users/register',
        { username, email, password },
        config
      );

      setLoading(false);
      return true;
    } catch (err)
    {
      const message = err.response && err.response.data.message ? err.response.data.message : err.message;
      setError(message);
      setLoading(false);
      return false;
    }
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(
        'http://localhost:5001/api/users/login',
        { email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);

      setLoading(false);
      return true;
    } catch (err) {
      const message = err.response && err.response.data.message ? err.response.data.message : err.message;
      setError(message);
      setLoading(false);
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    register,
    login,
    logout,
    setError, // Exponemos para poder limpiar errores desde los componentes
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
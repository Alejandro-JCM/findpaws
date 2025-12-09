import { useState } from "react";
import axios from "axios";

export function useUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // El hook ahora espera un array de archivos
  const upload = async ({ files }) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    // Añadimos cada archivo al FormData. El nombre 'images' debe coincidir con el del backend.
    files.forEach(file => {
      formData.append('images', file);
    });
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      // Hacemos la petición POST a nuestra nueva ruta de subida
      const { data } = await axios.post('http://localhost:5001/api/upload', formData, config);

      // El backend ahora devuelve un array de URLs
      return { urls: data.images, error: null };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error al subir la imagen";
      setError(errorMsg);
      return { urls: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading, error };
}

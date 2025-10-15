import { useState } from "react";

export function useUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async ({ file }) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulación de upload - en producción esto se conectaría a un servicio real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Crear URL local para el archivo (en producción sería una URL del servidor)
      const localUrl = URL.createObjectURL(file);
      
      return { url: localUrl, error: null };
    } catch (err) {
      const errorMsg = "Failed to upload image";
      setError(errorMsg);
      return { url: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading, error };
}
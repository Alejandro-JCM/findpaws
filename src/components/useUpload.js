import { useState } from "react";
import axios from "axios";

export function useUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async ({ files }) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    // Añadimos cada archivo al FormData
    files.forEach(file => {
      formData.append('images', file);
    });
    
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Agregar timeout más largo para archivos grandes
        timeout: 300000, // 5 minutos
      };

      console.log('📤 Enviando archivos al servidor...', files);
      
      const { data } = await axios.post('http://localhost:5001/api/upload', formData, config);
      
      console.log('✅ Respuesta del servidor de upload:', data);
      
      // El backend ahora devuelve rutas con /backend/uploads/
      const imageUrls = data.images.map(image => {
        // Si ya es una URL completa, la dejamos tal cual
        if (image.startsWith('http')) return image;
        // Si empieza con /backend/uploads/, asumimos que es relativa al servidor backend
        if (image.startsWith('/backend/uploads/')) {
          return `http://localhost:5001${image}`;
        }
        // Si no, le agregamos la ruta base
        return `http://localhost:5001/backend/uploads/${image}`;
      });
      
      console.log('🔗 URLs procesadas:', imageUrls);
      
      return { 
        urls: imageUrls, 
        error: null,
        details: data.files || []
      };
    } catch (err) {
      console.error('❌ Error en upload:', err);
      let errorMsg = "Error al subir los archivos";
      
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      } else if (err.code === 'ECONNABORTED') {
        errorMsg = "La subida tardó demasiado. Intenta con archivos más pequeños.";
      }
      
      setError(errorMsg);
      return { urls: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading, error };
}
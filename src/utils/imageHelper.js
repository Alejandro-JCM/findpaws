// src/utils/imageHelper.js

/**
 * Convierte una ruta de imagen relativa en una URL absoluta
 * @param {string} imagePath - Ruta de la imagen (puede ser relativa o absoluta)
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (imagePath) => {
  console.log('🔍 imageHelper.getImageUrl recibió:', imagePath);
  
  if (!imagePath || imagePath.trim() === '') {
    console.warn('❌ Ruta de imagen vacía o indefinida');
    return getPlaceholderImage('Sin imagen');
  }
  
  // Si ya es una URL completa, la devolvemos tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('✅ Ya es URL completa:', imagePath);
    return imagePath;
  }
  
  // Si empieza con /backend/uploads/, asumimos que es relativa al servidor backend
  if (imagePath.startsWith('/backend/uploads/')) {
    const url = `http://localhost:5001${imagePath}`;
    console.log('🔗 Convertida (/backend/uploads/):', imagePath, '→', url);
    return url;
  }
  
  // Si empieza solo con /uploads/, agregamos /backend
  if (imagePath.startsWith('/uploads/')) {
    const url = `http://localhost:5001/backend${imagePath}`;
    console.log('🔗 Convertida (/uploads/):', imagePath, '→', url);
    return url;
  }
  
  // Si empieza con public/ o backend/, limpiar
  if (imagePath.startsWith('public/') || imagePath.startsWith('backend/')) {
    const cleanPath = imagePath.replace(/^(public\/|backend\/)/, '');
    const url = `http://localhost:5001/backend/uploads/${cleanPath}`;
    console.log('🔗 Convertida (con prefijo):', imagePath, '→', url);
    return url;
  }
  
  // Si no tiene / al inicio, asumimos que es un nombre de archivo
  const url = `http://localhost:5001/backend/uploads/${imagePath}`;
  console.log('🔗 Convertida (nombre archivo):', imagePath, '→', url);
  return url;
};

/**
 * Obtiene una imagen de placeholder si la original falla
 * @param {string} text - Texto para el placeholder
 * @returns {string} URL del placeholder
 */
export const getPlaceholderImage = (text = 'Sin imagen') => {
  const encodedText = encodeURIComponent(text);
  return `https://via.placeholder.com/300x200/cccccc/666666?text=${encodedText}`;
};

/**
 * Verifica si una URL de imagen es válida
 * @param {string} url - URL a verificar
 * @returns {boolean} true si la URL parece válida
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  // Lista de extensiones de imagen comunes
  const imageExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', 
    '.svg', '.tiff', '.ico', '.avif', '.heic', '.heif', '.jfif'
  ];
  
  // Verificar si la URL termina con una extensión de imagen
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.endsWith(ext));
};
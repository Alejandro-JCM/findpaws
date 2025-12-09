const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');

// Asegurar que la carpeta de uploads existe
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    // Genera un nombre de archivo único conservando la extensión original
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Configurar multer para aceptar múltiples archivos SIN RESTRICCIONES
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB límite por archivo (más grande)
    files: 50 // Máximo 50 archivos
  },
  // SIN FILTRO DE TIPO DE ARCHIVO - acepta cualquier formato
}).array('images', 50);

// @desc    Subir una o más imágenes
// @route   POST /api/upload
router.post('/', (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Error de Multer
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          message: 'El archivo es demasiado grande. Máximo 50MB por archivo.' 
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ 
          message: 'Demasiados archivos. Máximo 50 archivos por publicación.' 
        });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // Otro error
      return res.status(400).json({ message: err.message });
    }

    // Verificar que se hayan subido archivos
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No se seleccionaron archivos.' });
    }

    try {
      // Obtener las rutas de los archivos subidos
      const images = req.files.map(file => {
        // Devolver ruta relativa para el frontend
        return `/uploads/${file.filename}`;
      });

      console.log('Archivos subidos exitosamente:', images);

      res.status(200).json({
        message: 'Archivos subidos con éxito',
        images: images,
        count: images.length,
        files: req.files.map(file => ({
          originalname: file.originalname,
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype
        }))
      });
    } catch (error) {
      console.error('Error procesando archivos:', error);
      res.status(500).json({ message: 'Error procesando los archivos' });
    }
  });
});

// @desc    Obtener información sobre la configuración de upload
// @route   GET /api/upload/config
router.get('/config', (req, res) => {
  res.json({
    maxFileSize: '50MB',
    maxFiles: 50,
    allowedTypes: 'Todos los formatos',
    uploadPath: uploadDir
  });
});

module.exports = router;
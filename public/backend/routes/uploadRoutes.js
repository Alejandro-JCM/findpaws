const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');

// IMPORTANTE: Usar path correcto dentro de backend
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Carpeta de uploads creada:', uploadDir);
}

// Configuración de Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    // Genera un nombre de archivo único con timestamp y random
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const uniqueName = `${timestamp}-${random}${ext}`;
    console.log(`📤 Guardando archivo: ${file.originalname} -> ${uniqueName}`);
    cb(null, uniqueName);
  },
});

// Configurar multer para aceptar múltiples archivos
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB límite por archivo
    files: 50 // Máximo 50 archivos
  },
  fileFilter: (req, file, cb) => {
    // Aceptar cualquier tipo de archivo para debugging
    console.log(`📄 Archivo recibido: ${file.originalname}, MIME: ${file.mimetype}`);
    cb(null, true);
  }
}).array('images', 50);

// @desc    Subir una o más imágenes
// @route   POST /api/upload
router.post('/', (req, res) => {
  console.log('📤 Iniciando subida de archivos...');
  
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('❌ Error de Multer:', err);
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
      return res.status(400).json({ message: `Error de Multer: ${err.message}` });
    } else if (err) {
      console.error('❌ Error en upload:', err);
      return res.status(400).json({ message: `Error: ${err.message}` });
    }

    // Verificar que se hayan subido archivos
    if (!req.files || req.files.length === 0) {
      console.log('⚠️ No se seleccionaron archivos');
      return res.status(400).json({ message: 'No se seleccionaron archivos.' });
    }

    console.log(`✅ Archivos recibidos: ${req.files.length} archivo(s)`);
    
    try {
      // Obtener las rutas de los archivos subidos
      const images = req.files.map(file => {
        // Devolver ruta relativa para el frontend
        const imagePath = `/backend/uploads/${file.filename}`;
        console.log(`📁 Ruta generada: ${imagePath}`);
        return imagePath;
      });

      console.log('✅ Archivos subidos exitosamente:', images);

      res.status(200).json({
        message: 'Archivos subidos con éxito',
        images: images,
        count: images.length,
        files: req.files.map(file => ({
          originalname: file.originalname,
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype,
          path: `/backend/uploads/${file.filename}`
        }))
      });
    } catch (error) {
      console.error('❌ Error procesando archivos:', error);
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
    uploadPath: uploadDir,
    publicPath: '/backend/uploads/'
  });
});

module.exports = router;
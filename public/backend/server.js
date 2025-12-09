// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware para permitir peticiones CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5001', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};
app.use(cors(corsOptions));

// Middleware para parsear JSON del body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IMPORTANTE: Crear carpetas necesarias si no existen
// Ruta dentro de backend: public/backend/public/uploads
const backendDir = __dirname;
const uploadsDir = path.join(__dirname, 'public', 'uploads');

console.log('📁 Directorio backend:', backendDir);
console.log('📁 Directorio uploads:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Carpeta uploads creada:', uploadsDir);
}

// Servir archivos estáticos desde la carpeta public/uploads dentro de backend
app.use('/backend/uploads', express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    // Permitir acceso desde cualquier origen (para desarrollo)
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Cache por 1 día
    res.setHeader('Cache-Control', 'public, max-age=86400');
    
    // Configurar tipos MIME dinámicamente
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
      '.json': 'application/json'
    };
    
    if (mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
    } else {
      res.setHeader('Content-Type', 'application/octet-stream');
    }
    
    console.log(`📁 Sirviendo archivo: ${filePath}, MIME: ${mimeTypes[ext] || 'unknown'}`);
  }
}));

// Ruta principal
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>FindPaws API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #3b82f6;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 10px;
        }
        .endpoint {
          background: #f8fafc;
          padding: 15px;
          margin: 15px 0;
          border-left: 4px solid #3b82f6;
          border-radius: 5px;
        }
        .method {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 3px;
          font-weight: bold;
          margin-right: 10px;
        }
        .get { background: #10b981; color: white; }
        .post { background: #3b82f6; color: white; }
        .put { background: #f59e0b; color: white; }
        .delete { background: #ef4444; color: white; }
        code {
          background: #e5e7eb;
          padding: 2px 5px;
          border-radius: 3px;
          font-family: monospace;
        }
        a {
          color: #3b82f6;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 FindPaws API</h1>
        <p><strong>Estado:</strong> ✅ En línea</p>
        <p><strong>URL Base:</strong> <code>http://localhost:${process.env.PORT || 5001}</code></p>
        
        <h2>📊 Endpoints Disponibles</h2>
        
        <div class="endpoint">
          <span class="method get">GET</span>
          <strong>/api/pets</strong> - Obtener todos los reportes de mascotas
          <br><code>http://localhost:${process.env.PORT || 5001}/api/pets</code>
        </div>
        
        <div class="endpoint">
          <span class="method post">POST</span>
          <strong>/api/pets</strong> - Crear nuevo reporte (requiere token)
          <br><code>http://localhost:${process.env.PORT || 5001}/api/pets</code>
        </div>
        
        <div class="endpoint">
          <span class="method post">POST</span>
          <strong>/api/upload</strong> - Subir imágenes/archivos
          <br><code>http://localhost:${process.env.PORT || 5001}/api/upload</code>
        </div>
        
        <div class="endpoint">
          <span class="method post">POST</span>
          <strong>/api/users/register</strong> - Registrar usuario
          <br><code>http://localhost:${process.env.PORT || 5001}/api/users/register</code>
        </div>
        
        <div class="endpoint">
          <span class="method post">POST</span>
          <strong>/api/users/login</strong> - Iniciar sesión
          <br><code>http://localhost:${process.env.PORT || 5001}/api/users/login</code>
        </div>
        
        <h2>🔧 Herramientas de Desarrollo</h2>
        <ul>
          <li><a href="/backend/uploads" target="_blank">📁 Ver archivos subidos</a></li>
          <li><a href="/api/upload/config" target="_blank">⚙️ Configuración de upload</a></li>
          <li><a href="/test-upload" target="_blank">📤 Probar subida de archivos</a></li>
          <li><a href="http://localhost:5173" target="_blank">🌐 Ir al frontend</a></li>
        </ul>
        
        <h2>📝 Información Técnica</h2>
        <p><strong>Base de datos:</strong> MongoDB</p>
        <p><strong>Carpeta de uploads:</strong> <code>${uploadsDir}</code></p>
        <p><strong>URL de uploads:</strong> <code>/backend/uploads/</code></p>
        <p><strong>Límite de archivos:</strong> 50 archivos por petición</p>
        <p><strong>Tamaño máximo:</strong> 50MB por archivo</p>
        <p><strong>Formatos permitidos:</strong> Cualquier formato</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.9em;">
          <p>📞 Para soporte, revisa la consola del servidor o los logs de error.</p>
          <p>📁 Ruta física de uploads: ${uploadsDir}</p>
          <p>🔗 URL de acceso: http://localhost:${process.env.PORT || 5001}/backend/uploads/</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Ruta de prueba para verificar archivos estáticos
app.get('/test-upload', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test de Upload</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        form { margin: 20px 0; padding: 20px; border: 1px solid #ccc; border-radius: 5px; }
        input, button { padding: 10px; margin: 5px; }
        .result { margin-top: 20px; padding: 10px; background: #f0f0f0; }
      </style>
    </head>
    <body>
      <h1>🧪 Test de Subida de Archivos</h1>
      <form id="uploadForm" enctype="multipart/form-data">
        <input type="file" name="images" multiple>
        <button type="submit">Subir Archivos</button>
      </form>
      <div id="result" class="result"></div>
      
      <script>
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const formData = new FormData();
          const files = document.querySelector('input[type="file"]').files;
          
          for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
          }
          
          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            });
            
            const result = await response.json();
            const resultDiv = document.getElementById('result');
            
            if (response.ok) {
              resultDiv.innerHTML = \`
                <h3>✅ Subida exitosa</h3>
                <p>Archivos subidos: \${result.count}</p>
                <ul>
                  \${result.images.map(img => \`
                    <li>
                      <a href="\${img}" target="_blank">\${img}</a>
                      <br>
                      <img src="\${img}" style="max-width: 100px; max-height: 100px; margin: 5px;">
                    </li>
                  \`).join('')}
                </ul>
              \`;
            } else {
              resultDiv.innerHTML = \`
                <h3>❌ Error</h3>
                <p>\${result.message}</p>
              \`;
            }
          } catch (error) {
            document.getElementById('result').innerHTML = \`
              <h3>❌ Error de conexión</h3>
              <p>\${error.message}</p>
            \`;
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Ruta para listar archivos en uploads
app.get('/backend/uploads', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error al leer la carpeta uploads');
    }
    
    const fileList = files.map(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      const fileUrl = `/backend/uploads/${file}`;
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file);
      
      return {
        name: file,
        url: fileUrl,
        size: `${(stats.size / 1024).toFixed(2)} KB`,
        modified: stats.mtime,
        isImage: isImage
      };
    });
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Archivos Subidos</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
          th { background: #f5f5f5; }
          img { max-width: 100px; max-height: 100px; }
          .image-cell { text-align: center; }
        </style>
      </head>
      <body>
        <h1>📁 Archivos en /backend/uploads</h1>
        <p>Total: ${fileList.length} archivos</p>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tamaño</th>
              <th>Modificado</th>
              <th>Vista previa</th>
              <th>Enlace</th>
            </tr>
          </thead>
          <tbody>
            ${fileList.map(file => `
              <tr>
                <td>${file.name}</td>
                <td>${file.size}</td>
                <td>${file.modified.toLocaleString()}</td>
                <td class="image-cell">
                  ${file.isImage ? `<img src="${file.url}" alt="${file.name}" onerror="this.style.display='none'">` : '📄'}
                </td>
                <td><a href="${file.url}" target="_blank">Abrir</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p style="margin-top: 20px;">
          <a href="/">← Volver al inicio</a>
        </p>
      </body>
      </html>
    `);
  });
});

// Ruta para probar si las imágenes se están sirviendo
app.get('/test-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(uploadsDir, filename);
  
  if (fs.existsSync(filepath)) {
    console.log('✅ Archivo encontrado:', filepath);
    
    // Determinar tipo MIME
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
      '.json': 'application/json'
    };
    
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.sendFile(filepath);
  } else {
    console.log('❌ Archivo NO encontrado:', filepath);
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Archivo no encontrado</title></head>
      <body>
        <h1>❌ Archivo no encontrado</h1>
        <p>El archivo <strong>${filename}</strong> no existe en la carpeta uploads.</p>
        <p>Ruta buscada: ${filepath}</p>
        <p><a href="/backend/uploads">Ver archivos disponibles</a></p>
      </body>
      </html>
    `);
  }
});

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'connected',
    uploadsDir: uploadsDir,
    publicPath: '/backend/uploads/'
  });
});

// Usar las rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/upload', uploadRoutes);

// Middleware para rutas no encontradas (404)
app.use(notFound);

// Middleware para manejar todos los demás errores
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Función para mostrar información de inicio
const showStartupInfo = () => {
  console.log('\n🚀 ==========================================');
  console.log('   FindPaws API Server');
  console.log('   ==========================================\n');
  console.log(`   ✅ Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`   📁 Uploads: http://localhost:${PORT}/backend/uploads`);
  console.log(`   📁 Ruta física de uploads: ${uploadsDir}`);
  console.log(`   🧪 Test: http://localhost:${PORT}/test-upload`);
  console.log(`   🩺 Health: http://localhost:${PORT}/health`);
  console.log(`   🌐 Frontend: http://localhost:5173`);
  console.log('\n   📊 Endpoints disponibles:');
  console.log('   ------------------------------------------');
  console.log('   GET  /api/pets           - Listar mascotas');
  console.log('   POST /api/pets           - Crear mascota');
  console.log('   POST /api/upload         - Subir archivos');
  console.log('   POST /api/users/register - Registrar usuario');
  console.log('   POST /api/users/login    - Iniciar sesión');
  console.log('\n   ==========================================\n');
};

app.listen(PORT, () => {
  showStartupInfo();
  
  // Verificar que la carpeta de uploads esté accesible
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    console.log(`   📁 Carpeta uploads: ${files.length} archivos`);
    if (files.length > 0) {
      console.log('   Archivos disponibles:');
      files.slice(0, 5).forEach(file => {
        console.log(`   - ${file} (http://localhost:${PORT}/backend/uploads/${file})`);
      });
      if (files.length > 5) {
        console.log(`   ... y ${files.length - 5} más`);
      }
    }
  } else {
    console.log('   ⚠️ Carpeta uploads no encontrada, se creará al subir archivos');
  }
});
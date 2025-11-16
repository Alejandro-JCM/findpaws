// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Importar rutas
const userRoutes = require('./config/userRoutes');
const petRoutes = require('./config/petRoutes');
const { notFound, errorHandler } = require('./errorMiddleware');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware para permitir peticiones CORS (desde tu frontend React)
// Es importante ser explícito sobre el origen para evitar errores de CORS.
const corsOptions = {
  origin: 'http://localhost:5173', // El puerto donde corre tu app de React
  optionsSuccessStatus: 200 // Para navegadores antiguos
};
app.use(cors(corsOptions));

// Middleware para parsear JSON del body de las peticiones
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de FindPaws está corriendo...');
});

// Usar las rutas
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);

// Middlewares de manejo de errores (deben ir al final)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`));

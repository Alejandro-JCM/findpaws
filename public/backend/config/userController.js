// backend/controllers/userController.js
const User = require('./UserModel');
const jwt = require('jsonwebtoken');

// Función para generar un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // El token expirará en 30 días
  });
};

/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  const { email, password, username } = req.body;

  try {
    // 1. Verificar si el email o el username ya existen
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

     if (userExists) {
       res.status(400); // Bad Request
       throw new Error('El usuario o email ya existe');
     }
    // 2. Crear el nuevo usuario (la contraseña se cifra gracias al middleware en el modelo)
    const user = await User.create({
      username,
      email,
      password,
    });

    // 3. Si el usuario se creó correctamente, responder con los datos y el token
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Datos de usuario inválidos');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Autenticar un usuario y obtener token (Login)
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario por su email
    const user = await User.findOne({ email });

    // 2. Si el usuario existe y la contraseña coincide (usando el método del modelo)
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401); // Unauthorized
      throw new Error('Email o contraseña inválidos');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener el perfil del usuario
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  // req.user es adjuntado por el middleware 'protect'
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
  // Nota: Los errores en rutas async sin try/catch son manejados por Express 5+
  // o necesitan un wrapper como express-async-handler para Express 4.
};

module.exports = { registerUser, loginUser, getUserProfile };
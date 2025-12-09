const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/users/register
 * @access  Público
 */
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('El usuario ya existe');
    }

    const user = await User.create({
      name,
      email,
      password, // El hash se hace en el modelo con un pre-save hook
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
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
 * @desc    Autenticar (login) un usuario
 * @route   POST /api/users/login
 * @access  Público
 */
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401); // No autorizado
      throw new Error('Email o contraseña inválidos');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener el perfil del usuario
 * @route   GET /api/users/profile
 * @access  Privado
 */
const getUserProfile = async (req, res) => {
  // req.user es establecido por el middleware 'protect'
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
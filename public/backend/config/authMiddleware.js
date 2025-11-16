// backend/config/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('./UserModel');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Obtener el token del header (viene como "Bearer TOKEN_LARGO")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificar y decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Buscar al usuario en la BD por el ID del token y adjuntarlo al request
      // Excluimos la contraseña del objeto de usuario que adjuntamos
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Continuar con la siguiente función (el controlador)
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error('No autorizado, token falló'));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error('No autorizado, no hay token'));
  }
};

module.exports = { protect };
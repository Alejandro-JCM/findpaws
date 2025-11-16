// backend/config/petController.js
const Pet = require('./PetModel');

/**
 * @desc    Crear un nuevo registro de mascota
 * @route   POST /api/pets
 * @access  Private
 */
const createPet = async (req, res, next) => {
  try {
    const {
      name,
      status,
      species,
      breed,
      color,
      size,
      age_estimate,
      gender,
      description,
      distinguishing_marks,
      images,
      location_address,
      location, // Recibimos el objeto de ubicación
      last_seen_date,
      is_emergency,
    } = req.body;

    const pet = new Pet({
      user: req.user._id, // El ID del usuario viene del middleware 'protect'
      name,
      status,
      species,
      breed,
      color,
      size,
      age_estimate,
      gender,
      description,
      distinguishing_marks,
      images,
      location_address,
      location,
      last_seen_date,
      is_emergency,
    });

    const createdPet = await pet.save();
    res.status(201).json(createdPet);
  } catch (error) {
    next(error);
  }
};

module.exports = { createPet };
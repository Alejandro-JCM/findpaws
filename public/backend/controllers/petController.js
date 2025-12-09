const Pet = require('../models/petModel');

/**
 * @desc    Obtener todos los reportes de mascotas
 * @route   GET /api/pets
 * @access  Público
 */
const getPetReports = async (req, res, next) => {
  try {
    const pets = await Pet.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener un reporte por ID
 * @route   GET /api/pets/:id
 * @access  Público
 */
const getPetReportById = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('user', 'name email');
    
    if (pet) {
      res.json(pet);
    } else {
      res.status(404);
      throw new Error('Reporte no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Crear un nuevo reporte de mascota
 * @route   POST /api/pets
 * @access  Privado
 */
const createPetReport = async (req, res, next) => {
  try {
    const {
      name,
      species,
      breed,
      color,
      size,
      age_estimate,
      gender,
      description,
      distinguishing_marks,
      location,
      location_address,
      last_seen_date,
      is_emergency,
      status,
      images,
    } = req.body;

    // Validación
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      res.status(400);
      throw new Error('Datos de ubicación inválidos o faltantes.');
    }
    
    if (!images || images.length === 0) {
      res.status(400);
      throw new Error('Debes subir al menos una foto.');
    }

    const pet = new Pet({
      user: req.user._id,
      name,
      species,
      breed,
      color,
      size,
      age_estimate,
      gender,
      description,
      distinguishing_marks,
      location,
      location_address,
      last_seen_date,
      is_emergency,
      status,
      images,
    });

    const createdPet = await pet.save();
    
    // Populate user info
    const populatedPet = await Pet.findById(createdPet._id)
      .populate('user', 'name email');
    
    res.status(201).json(populatedPet);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener los reportes del usuario logueado
 * @route   GET /api/pets/mypets
 * @access  Privado
 */
const getMyPetReports = async (req, res, next) => {
  try {
    const pets = await Pet.find({ user: req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(pets);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar un reporte de mascota
 * @route   PUT /api/pets/:id
 * @access  Privado
 */
const updatePetReport = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      res.status(404);
      throw new Error('Reporte no encontrado');
    }

    // Verificar que el usuario sea el dueño del reporte
    if (pet.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('No autorizado para actualizar este reporte');
    }

    const {
      name,
      species,
      breed,
      color,
      size,
      age_estimate,
      gender,
      description,
      distinguishing_marks,
      location,
      location_address,
      last_seen_date,
      is_emergency,
      status,
      images,
    } = req.body;

    // Validar si se están actualizando imágenes
    if (images && images.length === 0) {
      res.status(400);
      throw new Error('Debes mantener al menos una foto.');
    }

    // Actualizar campos de forma segura, solo si se proporcionan en el body
    const fieldsToUpdate = {
      name, species, breed, color, size, age_estimate, gender,
      description, distinguishing_marks, location, location_address,
      last_seen_date, is_emergency, status, images
    };

    Object.keys(fieldsToUpdate).forEach(key => {
      // Solo actualiza si el campo existe en el body de la petición
      // y no es undefined. Permite enviar "" o false.
      if (fieldsToUpdate[key] !== undefined) {
        pet[key] = fieldsToUpdate[key];
      }
    });

    const updatedPet = await pet.save();
    
    // Populate user info
    const populatedPet = await Pet.findById(updatedPet._id)
      .populate('user', 'name email');
    
    res.json(populatedPet);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar un reporte de mascota
 * @route   DELETE /api/pets/:id
 * @access  Privado
 */
const deletePetReport = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      res.status(404);
      throw new Error('Reporte no encontrado');
    }

    // Verificar que el usuario sea el dueño del reporte
    if (pet.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('No autorizado para eliminar este reporte');
    }

    await pet.deleteOne();
    
    res.json({ message: 'Reporte eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPetReports,
  getPetReportById,
  createPetReport,
  getMyPetReports,
  updatePetReport,
  deletePetReport,
};
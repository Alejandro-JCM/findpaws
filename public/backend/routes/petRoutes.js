const express = require('express');
const router = express.Router();
const {
  getPetReports,
  getPetReportById,
  createPetReport,
  getMyPetReports,
  updatePetReport,
  deletePetReport
} = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');

// Rutas públicas
router.route('/').get(getPetReports);
router.route('/:id').get(getPetReportById);

// Rutas protegidas (requieren autenticación)
router.route('/').post(protect, createPetReport);
router.route('/mypets').get(protect, getMyPetReports);
router.route('/:id').put(protect, updatePetReport);
router.route('/:id').delete(protect, deletePetReport);

module.exports = router;
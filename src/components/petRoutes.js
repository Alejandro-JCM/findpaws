// backend/config/petRoutes.js
const express = require('express');
const router = express.Router();
const { createPet } = require('./petController');
const { protect } = require('./authMiddleware');

router.route('/').post(protect, createPet);

module.exports = router;
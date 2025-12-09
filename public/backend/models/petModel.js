const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number], // [longitud, latitud]
    required: true,
    index: '2dsphere', // Índice geoespacial para búsquedas de proximidad
  },
});

const petSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['lost', 'found', 'available_for_adoption'],
    },
    species: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
    },
    color: { type: String },
    size: { type: String },
    age_estimate: { type: String },
    gender: { type: String },
    description: {
      type: String,
    },
    distinguishing_marks: {
      type: String,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    location: {
      type: locationSchema,
      required: true,
    },
    // --- CAMBIO AÑADIDO ---
    // Este campo se estaba enviando desde el frontend pero no existía en el modelo.
    location_address: {
      type: String,
    },
    last_seen_date: {
      type: Date,
    },
    is_emergency: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
// backend/models/PetModel.js
const mongoose = require('mongoose');

const petSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Referencia al modelo User
    },
    name: {
      type: String,
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
    color: {
      type: String,
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
    },
    age_estimate: {
      type: String,
      enum: ['puppy/kitten', 'young', 'adult', 'senior'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', ''],
    },
    description: {
      type: String,
    },
    distinguishing_marks: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    location_address: {
      type: String,
    },
    // Guardamos la ubicación como un punto GeoJSON para futuras búsquedas geoespaciales
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere', // Índice para búsquedas geoespaciales
      },
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
    timestamps: true,
  }
);

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
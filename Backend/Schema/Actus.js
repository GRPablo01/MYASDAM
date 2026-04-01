const mongoose = require('mongoose');

const ActusSchema = new mongoose.Schema({

  titre: {
    type: String,
    required: true,
    trim: true
  },

  auteur: {
    type: String,
    required: false,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  image: {
    type: String,
    required: true
  },

  saison: {
    type: String,
    required: true,
    default: '2026'
  },

  dateCreation: {
    type: Date,
    default: Date.now
  },

  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }

});

module.exports = mongoose.model('Actus', ActusSchema);
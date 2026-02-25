const mongoose = require('mongoose');

const CommentaireSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  contenu: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const ActusSchema = new mongoose.Schema({

  nom: {
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

  likes: {
    type: Number,
    default: 0
  },

  favoris: {
    type: Number,
    default: 0
  },

  commentaires: {
    type: [CommentaireSchema],
    default: []
  },

  key: {
    type: String,
    required: true,
    unique: true, // assure que chaque key est unique
    trim: true
  }

});

module.exports = mongoose.model('Actus', ActusSchema);

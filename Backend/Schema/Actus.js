const mongoose = require('mongoose');

// Schéma des commentaires
const CommentaireSchema = new mongoose.Schema({
  nomComplet: {        // ici on met nom + prénom
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

// Schéma des actualités
const ActusSchema = new mongoose.Schema({

  titre: {            // nouveau champ pour le titre de l'actualité
    type: String,
    required: true,
    trim: true
  },

  auteur: {           // facultatif, nom complet de l'auteur de l'actu
    type: String,
    required: false,
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
    unique: true,
    trim: true
  }

});

module.exports = mongoose.model('Actus', ActusSchema);

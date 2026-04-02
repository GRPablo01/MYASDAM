const mongoose = require('mongoose');

// ==========================
// Schéma joueur avec disponibilité
// ==========================
const joueurSchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: true, 
    unique: true 
  },

  nom: { 
    type: String, 
    required: true 
  },

  prenom: { 
    type: String 
  },

  email: { 
    type: String,
    required: true // tu peux mettre false si optionnel
  },

  present: { 
    type: String,
    enum: ['oui', 'non', 'non_repondu'],
    default: 'non_repondu'
  }
});

// ==========================
// Schéma convocation
// ==========================
const convocationSchema = new mongoose.Schema({
  joueurs: {
    type: [joueurSchema], // 🔹 tableau d'objets joueur
    required: [true, 'Le tableau de joueurs est obligatoire'],
    validate: [arr => arr.length > 0, 'Il doit y avoir au moins un joueur']
  },
  equipe: {
    type: String,
    required: true
  },
  match: {
    type: String,
    required: true
  },
  dateMatch: {
    type: Date,
    required: true
  },
  lieu: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Convocation', convocationSchema);
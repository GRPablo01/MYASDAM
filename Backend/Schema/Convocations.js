const mongoose = require('mongoose');

const convocationSchema = new mongoose.Schema({
  joueurs: {                       // 🔹 Renommé en "joueurs" pour plus de clarté
    type: [String],                 // 🔹 Tableau de chaînes de caractères
    required: true
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

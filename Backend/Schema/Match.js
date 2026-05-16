const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  date: { type: String, required: true },
  heure: { type: String, required: true },
  lieu: { type: String, required: true },
  equipeDom: { type: String, required: true },
  logoDom: { type: String, required: false },
  equipeExt: { type: String, required: true },
  logoExt: { type: String, required: false },
  typeMatch: { type: String, required: true },
  categorie: { type: String, required: true },
  scoreDom: { type: Number, default: 0 },
  scoreExt: { type: Number, default: 0 },
  statut: { type: String, default: 'À venir' },

  // Gestion du temps du match
  minute: { type: Number, default: 0 },           // Minute actuelle (0-90+)
  tempsEcoule: { type: Number, default: 0 },        // Temps en secondes pour le chronomètre
  periode: { type: String, default: '1MT' },      // 1MT, MI-TPS, 2MT, PROL, TAB, TER
  tempsAdditionnel: { type: Number, default: 0 }, // Minutes ajoutées

  localisationMatch: { type: String, required: true },
  key: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Match', MatchSchema);
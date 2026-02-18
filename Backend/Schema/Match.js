const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  date: { type: String, required: true },
  heure: { type: String, required: true },
  lieu: { type: String, required: true },
  equipeDom: { type: String, required: true },
  logoDom: { type: String, required: true },
  equipeExt: { type: String, required: true },
  logoExt: { type: String, required: true },
  typeMatch: { type: String, required: true },
  categorie: { type: String, required: true },
  scoreDom: { type: Number, default: 0 },
  scoreExt: { type: Number, default: 0 },
  statut: { type: String, default: 'A venir' },
  localisationMatch: { type: String, required: true },
  key: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Match', MatchSchema);

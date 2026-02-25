const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const crypto = require('crypto'); // pour générer la key unique

// Schéma équipe
const equipeSchema = new Schema({
  nom: { type: String, required: true },
  logo: { type: String, required: true }, // chemin vers l'image dans uploads
  saison: { type: String, required: true },
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    default: () => crypto.randomBytes(8).toString('hex') // ex: "4f2a1b8c9d3e7f0a"
  }
}, { timestamps: true });

const Equipe = model('Equipe', equipeSchema);

module.exports = Equipe;

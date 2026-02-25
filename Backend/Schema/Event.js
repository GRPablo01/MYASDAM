const mongoose = require('mongoose');
const crypto = require('crypto'); // pour générer la clé unique

const EventSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  lieu: { type: String },

  // Nouveaux champs
  heureDebut: { type: String },  // Format "HH:mm" ou "HH:mm:ss"
  heureFin: { type: String },    // Format "HH:mm" ou "HH:mm:ss"
  
  // Thème ou type de l'événement
  theme: { type: String },       // Exemple: "Sport", "Réunion", etc.

  // Catégorie d’âge/niveau
  categorie: { 
    type: String, 
    enum: ['U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U19'], 
    required: true 
  },

  statut: { type: String, enum: ['À Venir', 'En Cours', 'Terminé'], default: 'À Venir' },

  createdBy: { type: String, required: true },

  // Clé unique pour chaque événement
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    default: () => crypto.randomBytes(8).toString('hex') // ex: "4f2a1b8c9d3e7f0a"
  }

}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);

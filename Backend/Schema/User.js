const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// =========================
// Schéma Mongoose pour un utilisateur
// =========================
const userSchema = new mongoose.Schema({

  // ------------------------
  // Champs communs
  // ------------------------
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: { 
    type: String, 
    enum: ['joueur', 'entraineur', 'admin', 'invité'], 
    default: 'joueur' 
  },

  club: { type: String, default: '' },

  theme: { 
    type: String, 
    enum: ['sombre', 'clair'], 
    default: 'clair' 
  },

  // 🔐 Code d'accès (pas pour invité)
  codeAcces: {
    type: String,
    required: function() {
      return this.role !== 'invité';
    }
  },

  equipe: {
    type: String,
    enum: [
      'U6','U7','U8','U9','U10','U11',
      'U12','U13','U13F','U18','U23',
      'SeniorA','SeniorB','SeniorD'
    ],
    required: function() {
      return this.role === 'joueur' || this.role === 'entraineur';
    }
  },

  initiales: { type: String },

  key: { type: String, unique: true },

  status: { 
    type: String, 
    enum: ['En ligne', 'Ne pas deranger', 'Absent', 'ne pas deranger'], 
    default: 'En ligne' 
  },
  
  cookie: {
    type: String,
    enum: ['accepter', 'refuser'],
    default: ''
  },
  
  
  compte: { 
    type: String, 
    enum: ['actif', 'désactivé', 'supprimé'], 
    default: 'actif' 
  },

  compteDesactiveTime: { type: String, default: '' },

  notification: {
    type: [String],
    default: []
  },


});

// =========================
// 🔒 Règles métiers selon rôle
// =========================
userSchema.pre('validate', function() {
  // invité = pas d'équipe + pas de code
  if (this.role === 'invité') {
    this.equipe = undefined;
    this.codeAcces = undefined;
  }

  // admin = accès toutes équipes
  if (this.role === 'admin') {
    this.equipe = 'ALL';
  }

  // plus besoin de next()
});


// =========================
// 🔐 Hash password
// =========================
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// =========================
// 🔑 Comparer mot de passe
// =========================
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

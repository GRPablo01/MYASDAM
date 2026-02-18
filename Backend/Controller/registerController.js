const User = require('../Schema/User');
const bcrypt = require('bcrypt');

// ==============================
// 🔑 Génération aléatoire de clé
// ==============================
function randomSuffix(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateKey() {
  const numberPart = Math.floor(Math.random() * 100000);
  const suffix = randomSuffix(5);
  return `${numberPart}${suffix}`;
}

// =========================
// Controller pour l'inscription d'un utilisateur
// =========================
exports.registerUser = async (req, res) => {
  try {
    // ------------------------
    // Récupération des données depuis le body
    // ------------------------
    let {
      nom,
      prenom,
      email,
      password,
      role,
      poste,
      numeroMaillot,
      club,
      theme,
      equipe,
      codeAcces,
      key,
      status,
      compte,
      compteDesactiveTime,
      notification,
      cookie
    } = req.body;

    // ------------------------
    // Gestion des champs optionnels et valeurs par défaut
    // ------------------------
    poste = poste || undefined;
    numeroMaillot = numeroMaillot || undefined;
    club = club || undefined;
    theme = theme || 'clair';
    status = status || 'présent';
    compte = compte || 'actif';
    compteDesactiveTime = compteDesactiveTime || '';
    cookie = cookie || '';
    notification = Array.isArray(notification) ? notification : [];

    // ------------------------
    // Génération automatique de la key
    // ------------------------
    key = key || generateKey();

    // ------------------------
    // Vérification si l'email existe déjà
    // ------------------------
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // ------------------------
    // 🔥 Règles métiers selon rôle
    // ------------------------
    if (role === 'invité') {
      equipe = undefined;
      codeAcces = undefined;
    }

    if (role === 'admin') {
      equipe = 'ALL';
      if (!codeAcces || codeAcces === '') {
        return res.status(400).json({ message: 'Le code d\'accès est obligatoire pour un admin' });
      }
    }

    if (role === 'joueur' || role === 'entraineur') {
      if (!equipe || equipe === '') {
        return res.status(400).json({ message: `L'équipe est obligatoire pour le rôle ${role}` });
      }
      if (!codeAcces || codeAcces === '') {
        return res.status(400).json({ message: `Le code d'accès est obligatoire pour le rôle ${role}` });
      }
    }

    // ------------------------
    // 🔐 Hash du mot de passe avant création
    // ------------------------
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ------------------------
    // Création du nouvel utilisateur
    // ------------------------
    const user = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role,
      poste,
      numeroMaillot,
      club,
      theme,
      equipe,
      codeAcces,
      key,
      status,
      compte,
      compteDesactiveTime,
      notification,
      cookie
    });

    await user.save();

    // ------------------------
    // Réponse succès
    // ------------------------
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      userId: user._id,
      key,
      compte,
      compteDesactiveTime,
      cookie
    });

  } catch (error) {
    console.error('Erreur inscription:', error);

    // Gestion spécifique des erreurs Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation échouée', errors: messages });
    }

    if (error.code === 11000) { // duplication clé unique
      return res.status(400).json({ message: 'Email ou key déjà utilisé' });
    }

    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

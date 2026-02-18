// ==============================
// 📦 Imports
// ==============================
require('dotenv').config(); // Charger les variables d'environnement
const User = require('../Schema/User'); // Modèle Mongoose
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ==============================
// 🔑 Clé secrète JWT
// ==============================
const JWT_SECRET = process.env.JWT_SECRET || 'maCleSecreteParDefaut';

// ==============================
// 🔑 LOGIN
// ==============================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  try {
    // Recherche utilisateur par email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

    // Vérification du statut du compte
    if (user.compte === 'désactivé') {
      return res.status(403).json({ message: 'Compte désactivé', reason: 'désactivé' });
    }
    if (user.compte === 'supprimé') {
      return res.status(403).json({ message: 'Compte supprimé', reason: 'supprimé' });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Préparer la réponse utilisateur
    const userResponse = {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      club: user.club,
      theme: user.theme,
      equipe: user.equipe,
      initiales: user.initiales || `${user.prenom?.[0]?.toUpperCase() || ''}${user.nom?.[0]?.toUpperCase() || ''}`,
      key: user.key || null,
      status: user.status,
      compte: user.compte,
      suivis: user.suivis || [],
      abonnements: user.abonnements || [],
      poste: user.poste || null
    };

    return res.status(200).json({ message: 'Connexion réussie', user: userResponse, token });

  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🛡️ Middleware JWT
// ==============================
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token invalide' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token invalide' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// ==============================
// 👤 Récupérer utilisateur connecté
// ==============================
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    if (user.compte !== 'actif') {
      return res.status(403).json({
        message: user.compte === 'désactivé' ? 'Compte désactivé' : 'Compte supprimé',
        reason: user.compte
      });
    }

    return res.status(200).json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      club: user.club,
      theme: user.theme,
      equipe: user.equipe,
      initiales: user.initiales,
      key: user.key,
      status: user.status,
      compte: user.compte,
      suivis: user.suivis,
      abonnements: user.abonnements,
      poste: user.poste
    });
  } catch (error) {
    console.error('[GET CURRENT USER ERROR]', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

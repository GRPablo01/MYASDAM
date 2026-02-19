require('dotenv').config();
const User = require('../Schema/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'maCleSecreteParDefaut';

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

  try {
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    if (user.compte === 'désactivé') return res.status(403).json({ message: 'Compte désactivé' });
    if (user.compte === 'supprimé') return res.status(403).json({ message: 'Compte supprimé' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const userResponse = {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      club: user.club,
      theme: user.theme,
      equipe: user.equipe,
      initiales: user.initiales || `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`,
      key: user.key,
      status: user.status,
      compte: user.compte,
      suivis: user.suivis || [],
      abonnements: user.abonnements || [],
      poste: user.poste || null
    };

    res.status(200).json({ message: 'Connexion réussie', user: userResponse, token });

  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

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

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    if (user.compte !== 'actif') return res.status(403).json({ message: 'Compte non actif', reason: user.compte });

    res.status(200).json(user);
  } catch (error) {
    console.error('[GET CURRENT USER ERROR]', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

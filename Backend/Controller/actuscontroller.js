// ==============================
// 📦 Import du modèle
// ==============================
const Actus = require('../Schema/Actus');
const crypto = require('crypto'); // pour générer la key unique

// ==============================
// 🆕 Création d'une actualité
// ==============================
exports.creerActus = async (req, res) => {
  try {
    const { titre, auteur, saison } = req.body; // titre + auteur

    // Vérifier si une image a été envoyée
    if (!req.file) {
      console.warn('⚠️ Pas de fichier image envoyé !');
      return res.status(400).json({ message: "Image obligatoire" });
    }

    // Générer une clé unique aléatoire
    const keyUnique = crypto.randomBytes(8).toString('hex'); // ex: "4f2a1b8c9d3e7f0a"

    // Créer l'objet Actus avec champs supplémentaires
    const nouvelleActus = new Actus({
      titre,
      auteur: auteur || '',          // peut rester vide si non fourni
      saison: saison || '2026',
      image: req.file.filename,       // <-- stocke seulement le nom du fichier
      likes: 0,
      favoris: 0,
      commentaires: [],               // tableau vide au départ
      key: keyUnique
    });

    // Sauvegarder dans MongoDB
    await nouvelleActus.save();

    // Réponse au frontend
    res.status(201).json({
      message: 'Actus créée avec succès',
      data: nouvelleActus
    });

  } catch (error) {
    console.error('🔥 Erreur création actus :', error);
    res.status(500).json({
      message: 'Erreur serveur lors de la création',
      error: error.message
    });
  }
};

// ==============================
// 📃 Récupération des actualités
// ==============================
exports.getActus = async (req, res) => {
  try {
    // Récupérer toutes les actus triées par date de création descendante
    const actus = await Actus.find().sort({ dateCreation: -1 });
    res.json(actus);
  } catch (error) {
    console.error('🔥 Erreur récupération actus :', error);
    res.status(500).json({
      message: 'Erreur récupération actus',
      error: error.message
    });
  }
};

// toggle like par key
exports.toggleLikeParKey = async (req, res) => {
  try {
    const { key } = req.params;
    const { userId } = req.body; // l'identifiant unique de l'utilisateur

    const actus = await Actus.findOne({ key });
    if (!actus) return res.status(404).json({ message: 'Actu non trouvée' });

    if (!actus.likesUsers) actus.likesUsers = [];

    // Toggle like
    if (actus.likesUsers.includes(userId)) {
      actus.likesUsers = actus.likesUsers.filter(u => u !== userId);
    } else {
      actus.likesUsers.push(userId);
    }

    actus.likes = actus.likesUsers.length;
    await actus.save();

    res.json({ likes: actus.likes, isLiked: actus.likesUsers.includes(userId) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// toggle favori par key
exports.toggleFavoriParKey = async (req, res) => {
  try {
    const { key } = req.params;
    const { userId } = req.body;

    const actus = await Actus.findOne({ key });
    if (!actus) return res.status(404).json({ message: 'Actu non trouvée' });

    if (!actus.favorisUsers) actus.favorisUsers = [];

    // Toggle favori
    if (actus.favorisUsers.includes(userId)) {
      actus.favorisUsers = actus.favorisUsers.filter(u => u !== userId);
    } else {
      actus.favorisUsers.push(userId);
    }

    actus.favoris = actus.favorisUsers.length;
    await actus.save();

    res.json({ favoris: actus.favoris, isFavori: actus.favorisUsers.includes(userId) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


// Ajouter un commentaire par key
exports.ajouterCommentaireParKey = async (req, res) => {
  try {
    const { key } = req.params;
    const { nomComplet, contenu } = req.body;
    if (!nomComplet || !contenu) {
      return res.status(400).json({ message: 'Nom complet et contenu requis' });
    }
    const actus = await Actus.findOneAndUpdate(
      { key },
      { $push: { commentaires: { nomComplet, contenu } } },
      { new: true }
    );
    if (!actus) return res.status(404).json({ message: 'Actu non trouvée' });
    res.json({ message: 'Commentaire ajouté', data: actus });
  } catch (error) {
    console.error('🔥 Erreur ajout commentaire par key :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

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
    console.log('📄 req.body reçu :', req.body);
    console.log('📸 req.file reçu :', req.file);

    const { nom, saison } = req.body;

    // Vérifier si une image a été envoyée
    if (!req.file) {
      console.warn('⚠️ Pas de fichier image envoyé !');
      return res.status(400).json({ message: "Image obligatoire" });
    }

    // Générer une clé unique aléatoire
    const keyUnique = crypto.randomBytes(8).toString('hex'); // ex: "4f2a1b8c9d3e7f0a"

    // Créer l'objet Actus avec champs supplémentaires
    const nouvelleActus = new Actus({
      nom,
      saison,
      image: req.file.filename, // <-- stocke seulement le nom du fichier
      likes: 0,
      favoris: 0,
      commentaires: [], // tableau vide au départ
      key: keyUnique
    });

    // Sauvegarder dans MongoDB
    await nouvelleActus.save();
    console.log('✅ Actus sauvegardée :', nouvelleActus);

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
    console.log('📦 Actus récupérées :', actus.length);
    res.json(actus);
  } catch (error) {
    console.error('🔥 Erreur récupération actus :', error);
    res.status(500).json({
      message: 'Erreur récupération actus',
      error: error.message
    });
  }
};

// ==============================
// 👍 Ajouter un like
// ==============================
exports.ajouterLike = async (req, res) => {
  try {
    const { id } = req.params;
    const actus = await Actus.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json({ message: 'Like ajouté', data: actus });
  } catch (error) {
    console.error('🔥 Erreur ajout like :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// ==============================
// ⭐ Ajouter un favori
// ==============================
exports.ajouterFavori = async (req, res) => {
  try {
    const { id } = req.params;
    const actus = await Actus.findByIdAndUpdate(
      id,
      { $inc: { favoris: 1 } },
      { new: true }
    );
    res.json({ message: 'Favori ajouté', data: actus });
  } catch (error) {
    console.error('🔥 Erreur ajout favori :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// ==============================
// 💬 Ajouter un commentaire
// ==============================
exports.ajouterCommentaire = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, contenu } = req.body;

    if (!nom || !contenu) {
      return res.status(400).json({ message: 'Nom et contenu requis' });
    }

    const actus = await Actus.findByIdAndUpdate(
      id,
      { $push: { commentaires: { nom, contenu } } },
      { new: true }
    );

    res.json({ message: 'Commentaire ajouté', data: actus });
  } catch (error) {
    console.error('🔥 Erreur ajout commentaire :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

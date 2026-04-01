const Actus = require('../Schema/Actus');
const crypto = require('crypto');

// ==============================
// 🆕 Création d'une actualité
// ==============================
exports.creerActus = async (req, res) => {
  try {
    const { titre, auteur, saison, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image obligatoire" });
    }

    if (!description) {
      return res.status(400).json({ message: "Description obligatoire" });
    }

    const keyUnique = crypto.randomBytes(8).toString('hex');

    const nouvelleActus = new Actus({
      titre,
      auteur: auteur || '',
      saison: saison || '2026',
      description,
      image: req.file.filename,
      key: keyUnique
    });

    await nouvelleActus.save();

    res.status(201).json({
      message: 'Actus créée avec succès',
      data: nouvelleActus
    });

  } catch (error) {
    console.error('Erreur création actus :', error);
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
    const actus = await Actus.find().sort({ dateCreation: -1 });
    res.json(actus);
  } catch (error) {
    console.error('Erreur récupération actus :', error);
    res.status(500).json({
      message: 'Erreur récupération actus',
      error: error.message
    });
  }
};

// ==============================
// 🔍 Récupérer une actu par key
// ==============================
exports.getActuByKey = async (req, res) => {
  try {
    const { key } = req.params;

    const actu = await Actus.findOne({ key });

    if (!actu) {
      return res.status(404).json({ message: 'Actu non trouvée' });
    }

    res.json(actu);

  } catch (error) {
    console.error('Erreur récupération actu :', error);
    res.status(500).json({
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// ==============================
// ✏️ Modifier une actu
// ==============================
exports.updateActu = async (req, res) => {
  try {
    const { key } = req.params;
    const { titre, auteur, saison, description } = req.body;

    const actu = await Actus.findOne({ key });

    if (!actu) {
      return res.status(404).json({ message: 'Actu non trouvée' });
    }

    actu.titre = titre || actu.titre;
    actu.auteur = auteur || actu.auteur;
    actu.saison = saison || actu.saison;
    actu.description = description || actu.description;

    if (req.file) {
      actu.image = req.file.filename;
    }

    await actu.save();

    res.json({
      message: 'Actu modifiée avec succès',
      data: actu
    });

  } catch (error) {
    console.error('Erreur modification actu :', error);
    res.status(500).json({
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// ==============================
// 🗑️ Supprimer une actu
// ==============================
exports.deleteActu = async (req, res) => {
  try {
    const { key } = req.params;

    const actu = await Actus.findOneAndDelete({ key });

    if (!actu) {
      return res.status(404).json({ message: 'Actu non trouvée' });
    }

    res.json({ message: 'Actu supprimée avec succès' });

  } catch (error) {
    console.error('Erreur suppression actu :', error);
    res.status(500).json({
      message: 'Erreur serveur',
      error: error.message
    });
  }
};
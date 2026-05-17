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
// ✏️ UPDATE ACTU
// ==============================
exports.updateActu = async (id, updateData) => {

  const updated = await Actus.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  if (!updated) {
    throw new Error('Actu non trouvée');
  }

  return updated;
};


// ==============================
// 🗑️ DELETE ACTU (CONTROLLER)
// ==============================
exports.deleteActu = async (req, res) => {

  try {

    const id = req.params.id;

    const deleted = await Actus.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Actu non trouvée' });
    }

    return res.status(200).json({
      message: 'Actu supprimée',
      data: deleted
    });

  } catch (error) {
    console.error('DELETE ACTU ERROR:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
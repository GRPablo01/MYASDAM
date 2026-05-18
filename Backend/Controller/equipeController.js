const Equipe = require('../Schema/Equipe');
const fs = require('fs');

// ==============================
// 🔑 génération clé
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

// ==============================
// ➕ Ajouter équipe
// ==============================
exports.ajouterEquipe = async (req, res) => {
  try {
    const { nom, saison } = req.body;
    const logo = req.file ? req.file.path : null;

    if (!nom || !logo || !saison) {
      return res.status(400).json({
        message: 'Tous les champs sont obligatoires.'
      });
    }

    let keyUnique;
    let existe = true;

    while (existe) {
      keyUnique = generateKey();
      const exist = await Equipe.findOne({ key: keyUnique });
      if (!exist) existe = false;
    }

    const equipe = new Equipe({
      nom,
      logo,
      saison,
      key: keyUnique
    });

    await equipe.save();

    res.status(201).json({
      message: 'Équipe ajoutée',
      equipe
    });

  } catch (err) {
    res.status(500).json({
      message: 'Erreur ajout équipe',
      error: err.message
    });
  }
};

// ==============================
// 📥 GET équipes
// ==============================
exports.getEquipes = async (req, res) => {
  try {
    const saison = req.query.saison;
    const query = saison ? { saison } : {};

    const equipes = await Equipe.find(query).sort({ createdAt: -1 });

    res.json(equipes);

  } catch (err) {
    res.status(500).json({
      message: 'Erreur récupération équipes'
    });
  }
};

// ==============================
// ❌ DELETE équipe
// ==============================
exports.deleteEquipe = async (req, res) => {
  try {
    const deleted = await Equipe.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Équipe non trouvée"
      });
    }

    if (deleted.logo && fs.existsSync(deleted.logo)) {
      fs.unlinkSync(deleted.logo);
    }

    res.status(200).json({
      message: "Équipe supprimée",
      equipe: deleted
    });

  } catch (err) {
    res.status(500).json({
      message: "Erreur serveur"
    });
  }
};
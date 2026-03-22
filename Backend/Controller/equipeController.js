const Equipe = require('../Schema/Equipe');
const fs = require('fs');

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

exports.equipeController = {

  // ==============================
  // ➕ Ajouter une équipe
  // ==============================
  ajouterEquipe: async (req, res) => {
    try {
      const { nom, saison } = req.body;
      const logo = req.file ? req.file.path : null;

      if (!nom || !logo || !saison) {
        return res.status(400).json({
          message: 'Tous les champs (nom, logo, saison) sont obligatoires.'
        });
      }

      // 🔐 Génération d'une clé UNIQUE
      let keyUnique;
      let existe = true;

      while (existe) {
        keyUnique = generateKey();
        const equipeExistante = await Equipe.findOne({ key: keyUnique });
        if (!equipeExistante) {
          existe = false;
        }
      }

      const nouvelleEquipe = new Equipe({
        nom,
        logo,
        saison,
        key: keyUnique
      });

      await nouvelleEquipe.save();

      res.status(201).json({
        message: 'Équipe ajoutée avec succès !',
        equipe: nouvelleEquipe
      });

    } catch (err) {
      console.error('Erreur ajout équipe:', err);
      res.status(500).json({
        message: "Erreur lors de l'ajout de l'équipe",
        error: err.message
      });
    }
  },

  // ==============================
  // 📥 Récupérer les équipes
  // ==============================
  getEquipes: async (req, res) => {
    try {
      const saison = req.query.saison;
      const query = saison ? { saison } : {};

      const equipes = await Equipe
        .find(query)
        .sort({ createdAt: -1 });

      res.json(equipes);

    } catch (err) {
      console.error('Erreur récupération équipes:', err);
      res.status(500).json({
        message: 'Erreur lors de la récupération des équipes',
        error: err.message
      });
    }
  },

  // ==============================
  // ❌ Supprimer une équipe
  // ==============================
  supprimerEquipe: async (req, res) => {
    try {
      const { id } = req.params;

      const equipeSupprimee = await Equipe.findByIdAndDelete(id);

      if (!equipeSupprimee) {
        return res.status(404).json({
          message: 'Équipe non trouvée.'
        });
      }

      // 🗑️ Supprimer le logo du serveur
      if (equipeSupprimee.logo && fs.existsSync(equipeSupprimee.logo)) {
        fs.unlinkSync(equipeSupprimee.logo);
      }

      res.json({
        message: 'Équipe supprimée avec succès !',
        equipe: equipeSupprimee
      });

    } catch (err) {
      console.error('Erreur suppression équipe:', err);
      res.status(500).json({
        message: "Erreur lors de la suppression de l'équipe",
        error: err.message
      });
    }
  }
};
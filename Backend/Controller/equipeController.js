const Equipe = require('../Schema/Equipe');
const fs = require('fs');
const crypto = require('crypto'); // pour générer la key unique

exports.equipeController = {

  // Ajouter une nouvelle équipe
  ajouterEquipe: async (req, res) => {
    try {
      const { nom, saison } = req.body;
      const logo = req.file ? req.file.path : null;

      if (!nom || !logo || !saison) {
        return res.status(400).json({ message: 'Tous les champs (nom, logo, saison) sont obligatoires.' });
      }

      // Générer une clé unique pour l'équipe
      const keyUnique = crypto.randomBytes(8).toString('hex');

      const nouvelleEquipe = new Equipe({ 
        nom, 
        logo, 
        saison, 
        key: keyUnique 
      });

      await nouvelleEquipe.save();

      res.status(201).json({ message: 'Équipe ajoutée avec succès !', equipe: nouvelleEquipe });
    } catch (err) {
      console.error('Erreur ajout équipe:', err);
      res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'équipe', error: err.message });
    }
  },

  // Récupérer toutes les équipes ou filtrer par saison
  getEquipes: async (req, res) => {
    try {
      const saison = req.query.saison;
      const query = saison ? { saison } : {};

      const equipes = await Equipe.find(query).sort({ createdAt: -1 });
      res.json(equipes);
    } catch (err) {
      console.error('Erreur récupération équipes:', err);
      res.status(500).json({ message: 'Erreur lors de la récupération des équipes', error: err.message });
    }
  },

  // Supprimer une équipe par ID
  supprimerEquipe: async (req, res) => {
    try {
      const { id } = req.params;

      const equipeSupprimee = await Equipe.findByIdAndDelete(id);

      if (!equipeSupprimee) {
        return res.status(404).json({ message: 'Équipe non trouvée.' });
      }

      // Supprimer le fichier logo du serveur
      if (equipeSupprimee.logo && fs.existsSync(equipeSupprimee.logo)) {
        fs.unlinkSync(equipeSupprimee.logo);
      }

      res.json({ message: 'Équipe supprimée avec succès !', equipe: equipeSupprimee });
    } catch (err) {
      console.error('Erreur suppression équipe:', err);
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'équipe', error: err.message });
    }
  }
};

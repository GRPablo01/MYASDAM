const mongoose = require('mongoose');
const Convocation = require('../Schema/Convocations');

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

// ============================
// Créer une convocation
// ============================
exports.createConvocation = async (req, res) => {
  try {
    let { joueurs, equipe, match, dateMatch, lieu } = req.body;

    if (!joueurs || !equipe || !match || !dateMatch || !lieu) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
    }

    if (typeof joueurs === 'string') {
      joueurs = joueurs.split(',').map(nom => ({
        nom: nom.trim(),
        present: 'non_repondu',
        key: generateKey()
      }));
    } else if (Array.isArray(joueurs) && typeof joueurs[0] === 'string') {
      joueurs = joueurs.map(nom => ({
        nom: nom.trim(),
        present: 'non_repondu',
        key: generateKey()
      }));
    } else if (Array.isArray(joueurs)) {
      joueurs = joueurs.map(j => ({
        nom: j.nom?.trim() || '',
        present: j.present || 'non_repondu',
        key: j.key || generateKey()
      }));
    }

    const convocation = new Convocation({ 
      key: generateKey(),
      joueurs, 
      equipe, 
      match, 
      dateMatch, 
      lieu 
    });

    await convocation.save();
    console.log('💾 Convocation créée avec succès:', convocation);
    res.status(201).json(convocation);

  } catch (error) {
    console.error("❌ Erreur création convocation:", error.message);
    res.status(500).json({ message: "Erreur serveur lors de la création" });
  }
};

// ============================
// Récupérer toutes les convocations
// ============================
exports.getAllConvocations = async (req, res) => {
  try {
    const convocations = await Convocation.find().sort({ dateMatch: 1 });
    res.json(convocations);
  } catch (error) {
    console.error("❌ Erreur récupération convocations:", error.message);
    res.status(500).json({ message: "Erreur serveur lors de la récupération" });
  }
};

// ============================
// Récupérer une convocation par clé
// ============================
exports.getConvocationByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const convocation = await Convocation.findOne({ key });
    if (!convocation) return res.status(404).json({ message: 'Convocation non trouvée' });
    res.json(convocation);
  } catch (error) {
    console.error("❌ Erreur récupération convocation:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ============================
// Modifier une convocation par clé
// ============================
exports.updateConvocationByKey = async (req, res) => {
  try {
    const { key } = req.params;
    let { joueurs } = req.body;

    if (joueurs) {
      if (typeof joueurs === 'string') {
        joueurs = joueurs.split(',').map(nom => ({
          nom: nom.trim(),
          present: 'non_repondu',
          key: generateKey()
        }));
      } else if (Array.isArray(joueurs) && typeof joueurs[0] === 'string') {
        joueurs = joueurs.map(nom => ({
          nom: nom.trim(),
          present: 'non_repondu',
          key: generateKey()
        }));
      } else if (Array.isArray(joueurs)) {
        joueurs = joueurs.map(j => ({
          nom: j.nom?.trim() || '',
          present: j.present || 'non_repondu',
          key: j.key || generateKey()
        }));
      }
      req.body.joueurs = joueurs;
    }

    const convocation = await Convocation.findOneAndUpdate(
      { key },
      req.body,
      { new: true, runValidators: true }
    );

    if (!convocation) return res.status(404).json({ message: 'Convocation non trouvée' });

    console.log('🔄 Convocation mise à jour:', convocation);
    res.json(convocation);

  } catch (error) {
    console.error("❌ Erreur mise à jour convocation:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ============================
// Supprimer une convocation par clé
// ============================
exports.deleteConvocationByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const deleted = await Convocation.findOneAndDelete({ key });
    if (!deleted) return res.status(404).json({ message: 'Convocation non trouvée' });

    console.log('🗑️ Convocation supprimée:', deleted);
    res.json({ message: 'Convocation supprimée avec succès' });

  } catch (error) {
    console.error("❌ Erreur suppression convocation:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ============================
// 🔹 Mettre à jour le statut d'un joueur
// ============================
exports.updateStatutJoueurByKey = async (req, res) => {
  const { convocationId, joueurKey } = req.params;
  const { present } = req.body;

  console.log('🔹 Requête reçue pour mettre à jour le statut');
  console.log('convocationId:', convocationId, 'joueurKey:', joueurKey, 'present:', present);

  try {
    const convocation = await Convocation.findById(convocationId);
    console.log('Recherche de la convocation terminée:', convocation ? 'trouvée' : 'non trouvée');

    if (!convocation) {
      console.log('⚠️ Convocation non trouvée');
      return res.status(404).json({ message: 'Convocation non trouvée' });
    }

    const joueur = convocation.joueurs.find(j => j.key === joueurKey);
    console.log('Recherche du joueur terminée:', joueur ? 'trouvé' : 'non trouvé');

    if (!joueur) {
      console.log('⚠️ Joueur non trouvé dans cette convocation');
      return res.status(404).json({ message: 'Joueur non trouvé dans cette convocation' });
    }

    console.log(`🔄 Ancien statut du joueur: ${joueur.present}`);
    joueur.present = present;
    console.log(`✅ Nouveau statut du joueur: ${joueur.present}`);

    await convocation.save();
    console.log('💾 Convocation sauvegardée avec succès');

    res.status(200).json({ message: 'Statut mis à jour', joueur });

  } catch (err) {
    console.error('❌ Erreur serveur:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
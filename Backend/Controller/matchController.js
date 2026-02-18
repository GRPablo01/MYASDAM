const Match = require('../Schema/Match');
const crypto = require('crypto');

// 🏟️ Liste des stades à domicile
const stadesDomicile = [
  'stade de danjoutin',
  "stade d'andelnans"
];

// Créer un match
const createMatch = async (req, res) => {
  try {
    const { 
      date, 
      heure, 
      lieu, 
      equipeDom, 
      logoDom, 
      equipeExt, 
      logoExt, 
      typeMatch, 
      categorie 
    } = req.body;

    const keyUnique = crypto.randomBytes(8).toString('hex');

    // ✅ Détermination domicile / extérieur
    let localisationMatch = 'Exterieur';

    if (lieu && stadesDomicile.includes(lieu.toLowerCase())) {
      localisationMatch = 'Domicile';
    }

    const nouveauMatch = new Match({ 
      date, 
      heure, 
      lieu, 
      equipeDom, 
      logoDom, 
      equipeExt, 
      logoExt, 
      typeMatch, 
      categorie,
      scoreDom: 0,
      scoreExt: 0,
      statut: 'A venir',
      localisationMatch,
      key: keyUnique
    });

    await nouveauMatch.save();

    res.status(201).json({ 
      message: 'Match créé avec succès', 
      match: nouveauMatch 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du match' });
  }
};

// Récupérer tous les matchs
const getAllMatchs = async (req, res) => {
  try {
    const matchs = await Match.find();
    res.status(200).json(matchs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des matchs' });
  }
};

module.exports = { createMatch, getAllMatchs };

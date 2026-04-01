const Match = require('../Schema/Match');

// 🏟️ Liste des stades à domicile
const stadesDomicile = [
  'stade de danjoutin',
  "stade d'andelnans"
];

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

// ==============================
// ➕ Créer un match
// ==============================
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

    // 🔐 Génération clé UNIQUE
    let keyUnique;
    let existe = true;

    while (existe) {
      keyUnique = generateKey();
      const matchExistant = await Match.findOne({ key: keyUnique });
      if (!matchExistant) {
        existe = false;
      }
    }

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
      statut: 'À venir',
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

// ==============================
// 📥 Récupérer tous les matchs
// ==============================
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
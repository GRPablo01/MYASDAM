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
      key: keyUnique,
      // Initialisation du temps
      minute: 0,
      periode: null,
      tempsAdditionnel: 0
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

// ==============================
// 📥 Récupérer un match par ID
// ==============================
const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Match.findById(id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }
    
    res.status(200).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du match' });
  }
};

// ==============================
// 🔄 Mettre à jour un match
// ==============================
const updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const match = await Match.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }
    
    res.status(200).json({ 
      message: 'Match mis à jour avec succès', 
      match 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du match' });
  }
};

// ==============================
// 🗑️ Supprimer un match
// ==============================
const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Match.findByIdAndDelete(id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }
    
    res.status(200).json({ message: 'Match supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression du match' });
  }
};

// ==============================
// ▶️ Démarrer un match (1ère mi-temps)
// ==============================
const demarrerMatch = async (req, res) => {
  try {
    const { id } = req.params;
    
    const match = await Match.findByIdAndUpdate(
      id,
      {
        statut: 'En cours',
        periode: '1MT',
        minute: 1,
        tempsAdditionnel: 0
      },
      { new: true }
    );
    
    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }
    
    res.status(200).json({ 
      message: 'Match démarré - 1ère mi-temps', 
      match 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du démarrage du match' });
  }
};

// ==============================
// ⏱️ Mettre à jour la minute
// ==============================
const updateMinute = async (req, res) => {
  try {
    const { id } = req.params;
    const { minute, periode, tempsAdditionnel } = req.body;
    
    const updates = {};
    if (minute !== undefined) updates.minute = minute;
    if (periode !== undefined) updates.periode = periode;
    if (tempsAdditionnel !== undefined) updates.tempsAdditionnel = tempsAdditionnel;
    
    const match = await Match.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    
    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }
    
    res.status(200).json({ 
      message: 'Minute mise à jour', 
      match 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la minute' });
  }
};

// ==============================
// ⏸️ Mi-temps
// ==============================
const miTemps = async (req, res) => {
  try {
    const { id } = req.params;
    
    const match = await Match.findByIdAndUpdate(
      id,
      {
        periode: 'MI-TPS',
        minute: 45
      },
      { new: true }
    );
    
    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }
    
    res.status(200).json({ 
      message: 'Mi-temps', 
      match 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise en mi-temps' });
  }
};

// ==============================
// ▶️ Reprise 2ème mi-temps
// ==============================
const repriseSecondePeriode = async (req, res) => {
  try {
    const { id } = req.params;
    
    const match = await Match.findByIdAndUpdate(
      id,
      {
        periode: '2MT',
        minute: 46
      },
      { new: true }
    );
    
    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }
    
    res.status(200).json({ 
      message: 'Reprise 2ème mi-temps', 
      match 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la reprise' });
  }
};

// ==============================
// ⏹️ Terminer le match
// ==============================
const terminerMatch = async (req, res) => {
  try {
    const { id } = req.params;
    
    const match = await Match.findByIdAndUpdate(
      id,
      {
        statut: 'Terminé',
        periode: 'TER',
        minute: 90
      },
      { new: true }
    );
    
    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }
    
    res.status(200).json({ 
      message: 'Match terminé', 
      match 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la fin du match' });
  }
};

// ==============================
// ⚽ Mettre à jour le score
// ==============================
const updateScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { scoreDom, scoreExt } = req.body;
    
    const updates = {};
    if (scoreDom !== undefined) updates.scoreDom = scoreDom;
    if (scoreExt !== undefined) updates.scoreExt = scoreExt;
    
    const match = await Match.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    
    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }
    
    res.status(200).json({ 
      message: 'Score mis à jour', 
      match 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du score' });
  }
};

module.exports = { 
  createMatch, 
  getAllMatchs, 
  getMatchById,
  updateMatch,
  deleteMatch,
  demarrerMatch,
  updateMinute,
  miTemps,
  repriseSecondePeriode,
  terminerMatch,
  updateScore
};
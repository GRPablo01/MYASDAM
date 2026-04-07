const express = require('express');
const router = express.Router();
const { 
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
} = require('../Controller/matchController');

// ==============================
// 📋 CRUD de base
// ==============================

// GET /api/matchs -> récupérer tous les matchs
router.get('/', getAllMatchs);

// GET /api/matchs/:id -> récupérer un match par ID
router.get('/:id', getMatchById);

// POST /api/matchs -> créer un match
router.post('/', createMatch);

// PUT /api/matchs/:id -> mettre à jour un match complet
router.put('/:id', updateMatch);

// DELETE /api/matchs/:id -> supprimer un match
router.delete('/:id', deleteMatch);

// ==============================
// ⏱️ Gestion du temps de match (90 minutes)
// ==============================

// PATCH /api/matchs/:id/demarrer -> démarrer le match (1ère mi-temps)
router.patch('/:id/demarrer', demarrerMatch);

// PATCH /api/matchs/:id/minute -> mettre à jour la minute en cours
router.patch('/:id/minute', updateMinute);

// PATCH /api/matchs/:id/mitemps -> passage mi-temps
router.patch('/:id/mitemps', miTemps);

// PATCH /api/matchs/:id/reprise -> reprise 2ème mi-temps
router.patch('/:id/reprise', repriseSecondePeriode);

// PATCH /api/matchs/:id/terminer -> terminer le match
router.patch('/:id/terminer', terminerMatch);

// ==============================
// ⚽ Gestion du score
// ==============================

// PATCH /api/matchs/:id/score -> mettre à jour le score
router.patch('/:id/score', updateScore);

module.exports = router;
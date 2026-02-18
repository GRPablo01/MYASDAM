const express = require('express');
const router = express.Router();
const { createMatch, getAllMatchs } = require('../Controller/matchController');

// GET /api/matchs -> récupérer tous les matchs
router.get('/', getAllMatchs);

// POST /api/matchs -> créer un match
router.post('/', createMatch);

module.exports = router;

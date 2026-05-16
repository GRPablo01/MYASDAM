const express = require('express');
const router = express.Router();
const Log = require('../Schema/Log');

// =========================
// GET ALL LOGS
// =========================
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().sort({ date: -1 }).limit(200);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// ADD LOG
// =========================
router.post('/', async (req, res) => {
  try {
    const log = new Log({
      user: req.body.user,
      role: req.body.role,
      action: req.body.action,
      description: req.body.description
    });

    const saved = await log.save();

    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// CLEAR LOGS
// =========================
router.delete('/', async (req, res) => {
  try {
    await Log.deleteMany({});
    res.json({ message: 'Logs supprimés' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
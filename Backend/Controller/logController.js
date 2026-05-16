const Log = require('../Schema/Log');

// GET ALL LOGS
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ date: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// CREATE LOG (utile pour ton système)
exports.createLog = async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: 'Erreur création log' });
  }
};
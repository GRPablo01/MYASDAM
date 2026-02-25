const Convocation = require('../Schema/Convocations');

// ============================
// Créer une convocation
// ============================
exports.createConvocation = async (req, res) => {
  try {
    const convocation = new Convocation(req.body);
    await convocation.save();
    res.status(201).json(convocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

// ============================
// Récupérer une convocation
// ============================
exports.getConvocationById = async (req, res) => {
  try {
    const convocation = await Convocation.findById(req.params.id);
    res.json(convocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// Modifier une convocation
// ============================
exports.updateConvocation = async (req, res) => {
  try {
    const convocation = await Convocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(convocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// Supprimer une convocation
// ============================
exports.deleteConvocation = async (req, res) => {
  try {
    await Convocation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Convocation supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

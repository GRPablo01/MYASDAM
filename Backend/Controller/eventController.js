const Event = require('../Schema/Event');
const crypto = require('crypto');

// ================= CREATE =================
exports.createEvent = async (req, res) => {
  try {
    const {
      titre,
      description,
      date,
      lieu,
      heureDebut,
      heureFin,
      theme,
      categorie,
      statut,
      createdBy
    } = req.body;

    if (!titre || !date || !createdBy || !categorie) {
      return res.status(400).json({
        message: "Titre, date, créateur et catégorie sont obligatoires"
      });
    }

    const event = new Event({
      titre,
      description,
      date,
      lieu,
      heureDebut,
      heureFin,
      theme,
      categorie,
      statut: statut || "actif",
      createdBy,
      key: crypto.randomBytes(8).toString('hex')
    });

    const saved = await event.save();
    return res.status(201).json(saved);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// ================= GET ALL =================
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return res.status(200).json(events);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// ================= GET ONE EVENT =================
exports.getEventById = async (req, res) => {

  try {

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Événement non trouvé"
      });
    }

    return res.status(200).json(event);

  } catch (err) {

    return res.status(500).json({
      message: "Erreur serveur"
    });

  }
};

// ================= UPDATE =================
exports.updateEvent = async (req, res) => {
  try {

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          titre: req.body.titre,
          description: req.body.description,
          date: req.body.date,
          lieu: req.body.lieu,
          heureDebut: req.body.heureDebut,
          heureFin: req.body.heureFin,
          theme: req.body.theme,
          categorie: req.body.categorie,
          statut: req.body.statut
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    return res.status(200).json(updated);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// ================= DELETE =================
exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    return res.status(200).json({
      message: "Événement supprimé",
      event: deleted
    });

  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
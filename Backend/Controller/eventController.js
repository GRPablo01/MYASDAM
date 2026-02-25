const Event = require('../Schema/Event'); // Assure-toi que le chemin est correct
const crypto = require('crypto'); // pour générer la clé unique si besoin

// Créer un événement
exports.createEvent = async (req, res) => {
  try {
    const { titre, description, date, lieu, heureDebut, heureFin, theme, categorie, statut, createdBy } = req.body;

    if (!titre || !date || !createdBy || !categorie) {
      return res.status(400).json({ message: "Titre, date, créateur et catégorie sont obligatoires" });
    }

    // Générer une clé unique pour l'événement
    const keyUnique = crypto.randomBytes(8).toString('hex');

    const newEvent = new Event({
      titre,
      description,
      date,
      lieu,
      heureDebut,
      heureFin,
      theme,       // Nouveau champ theme/type
      categorie,   // Catégorie U6, U7, etc.
      statut,
      createdBy,
      key: keyUnique
    });

    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Erreur création événement:', err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Récupérer tous les events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (err) {
    console.error('Erreur récupération événements:', err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Supprimer un event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) return res.status(404).json({ message: "Événement non trouvé" });

    res.status(200).json({ message: "Événement supprimé", event: deletedEvent });
  } catch (err) {
    console.error('Erreur suppression événement:', err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Récupérer un événement par ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Événement non trouvé" });
    res.status(200).json(event);
  } catch (err) {
    console.error('Erreur récupération événement par ID:', err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Mettre à jour un événement
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, date, lieu, heureDebut, heureFin, theme, categorie, statut } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { titre, description, date, lieu, heureDebut, heureFin, theme, categorie, statut },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) return res.status(404).json({ message: "Événement non trouvé" });

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error('Erreur mise à jour événement:', err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const express = require('express');
const router = express.Router();

const contactController = require('../Controller/contactController');

// ➕ ajouter contact
router.post('/add', contactController.addContact);

// 📥 récupérer contacts
router.get('/:userId', contactController.getContacts);

// 🗑️ supprimer contact
router.delete('/remove', contactController.removeContact);

module.exports = router;
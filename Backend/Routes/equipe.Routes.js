const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { equipeController } = require('../Controller/equipeController');

// Configuration Multer pour stocker les fichiers dans /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // dossier où seront stockés les logos
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // nom unique
  }
});

const upload = multer({ storage: storage });

// Routes avec gestion du fichier
router.post('/', upload.single('logo'), equipeController.ajouterEquipe);  // POST avec logo
router.get('/', equipeController.getEquipes);                              // GET toutes équipes
router.delete('/:id', equipeController.supprimerEquipe);                   // DELETE par ID

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const equipeController = require('../Controller/equipeController');

// Configuration Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ROUTES
router.post(
  '/',
  upload.single('logo'),
  equipeController.ajouterEquipe
);

router.get(
  '/',
  equipeController.getEquipes
);

router.delete(
  '/:id',
  equipeController.deleteEquipe
);

module.exports = router;
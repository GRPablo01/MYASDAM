const express = require('express');
const router = express.Router();
const actusController = require('../Controller/actuscontroller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// -----------------------------
// 📁 Dossier uploads
// -----------------------------
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// -----------------------------
// 🖼️ Multer pour upload fichiers
// -----------------------------
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// -----------------------------
// 🌍 Routes
// -----------------------------
router.post('/', upload.single('image'), actusController.creerActus); // <- Multer ici !
router.get('/', actusController.getActus);

module.exports = router;

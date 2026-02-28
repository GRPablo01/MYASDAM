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
router.post('/', upload.single('image'), actusController.creerActus);
router.get('/', actusController.getActus);

// -----------------------------
// 👍 Likes, ⭐ Favoris, 💬 Commentaires par key
// -----------------------------
router.post('/:key/like', actusController.toggleLikeParKey);
router.post('/:key/favori', actusController.toggleFavoriParKey);
router.post('/:key/commentaire', actusController.ajouterCommentaireParKey);

module.exports = router;

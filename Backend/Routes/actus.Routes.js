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

router.put('/:id', upload.single('image'), async (req, res) => {
  try {

    const id = req.params.id;

    const updateData = {
      titre: req.body.titre,
      auteur: req.body.auteur,
      description: req.body.description,
      ...(req.file && { image: req.file.filename })
    };

    const updated = await actusController.updateActu(id, updateData);

    res.json({
      message: 'Actu modifiée avec succès',
      data: updated
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/:id', actusController.deleteActu);

module.exports = router;

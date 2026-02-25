// ==============================
// 📦 Import des modules
// ==============================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

// ==============================
// ⚙️ Configuration générale
// ==============================
const app = express();
const PORT = process.env.PORT || 3000;
const IP_LOCALE = process.env.IP_LOCALE || '192.168.1.43';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/myasdam';

// ==============================
// ✅ Middleware CORS
// ==============================
app.use(cors({
  origin: 'http://localhost:4200', // <-- ton frontend Angular
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user'],
  credentials: true               // <-- utile si JWT ou cookies
}));

// ==============================
// 🧱 Middlewares globaux
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// 📁 Dossier uploads
// ==============================
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📂 Dossier uploads créé : ${uploadDir}`);
}
app.use('/uploads', express.static(uploadDir));

// ==============================
// 🖼️ Multer (upload fichiers)
// ==============================
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// ==============================
// 🌍 Connexion MongoDB
// ==============================
mongoose.connect(MONGO_URI)
  .then(() => console.log(`✅ Connexion à MongoDB réussie sur ${MONGO_URI}`))
  .catch(err => {
    console.error('❌ Erreur MongoDB :', err.message);
    process.exit(1);
  });

// ==============================
// 🧩 Import des routes
// ==============================
const authRoutes = require('./Backend/Routes/auth.Routes');
const matchRoutes = require('./Backend/Routes/match.Routes');
const equipeRoutes = require('./Backend/Routes/equipe.Routes'); // <-- décommenter si besoin
const eventRoutes = require('./Backend/Routes/event.Routes');
const actusRoutes = require('./Backend/Routes/actus.Routes');
const userRoutes = require('./Backend/Routes/auth.Routes'); // nouvelle route /users
const convocationRoutes = require('./Backend/Routes/convocation.routes');

// ==============================
// 🧭 Routes API
// ==============================
app.use('/api/auth', authRoutes);
app.use('/api/matchs', matchRoutes);
app.use('/api/equipes', equipeRoutes); // <-- route équipe complète
app.use('/api/events', eventRoutes);
app.use('/api/actus', actusRoutes);
app.use('/api/user', userRoutes);   // /api/users
app.use('/api/convocation', convocationRoutes);

// ==============================
// 🏠 Routes de test
// ==============================
app.get('/', (_, res) => res.send('✅ Serveur ASDAM opérationnel !'));
app.get('/api', (_, res) => res.json({ message: 'Bienvenue sur l’API ASDAM !' }));

// ==============================
// 🚀 Lancement serveur
// ==============================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur backend démarré sur http://${IP_LOCALE}:${PORT}`);
  console.log(`📱 Accessible depuis téléphone : http://${IP_LOCALE}:${PORT}`);
});

// create-superadmin-mongo.js
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const readline = require('readline');

// ==============================
// 🔑 Génération aléatoire de clé
// ==============================
function randomSuffix(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateKey() {
  const numberPart = Math.floor(Math.random() * 100000);
  const suffix = randomSuffix(5);
  return `${numberPart}${suffix}`;
}

// Interface terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

// ==============================
// 🔒 Enum équipe
// ==============================
const EQUIPES = [
  'U6','U7','U8','U9','U10','U11',
  'U12','U13','U13F','U18','U23',
  'SeniorA','SeniorB','SeniorD','ALL'
];

// ==============================
// 🍪 Enum cookie
// ==============================
const COOKIES = ['accepter', 'refuser'];

async function main() {
  console.log('--- Création d\'un super admin MongoDB ---');

  const nom = await ask('Nom : ');
  const prenom = await ask('Prénom : ');
  const email = await ask('Email : ');
  const password = await ask('Mot de passe : ');

  // nouveaux champs
  const contactsInput = await ask('Contacts (séparés par virgule, optionnel) : ');
  const equipeInput = await ask('Equipe (U6...SeniorA, ALL ou vide) : ');
  const cookieInput = await ask('Cookie (accepter/refuser ou vide) : ');
  const codeAccesInput = await ask('Code d\'accès (obligatoire si pas invité) : ');

  rl.close();

  const hashedPassword = await bcrypt.hash(password, 12);

  // ==============================
  // 📞 contacts tableau
  // ==============================
  const contact = contactsInput
    ? contactsInput.split(',').map(c => c.trim()).filter(Boolean)
    : [];

  // ==============================
  // ⚽ équipe validation
  // ==============================
  let equipe = null;
  if (equipeInput && EQUIPES.includes(equipeInput.trim())) {
    equipe = equipeInput.trim();
  }

  // ==============================
  // 🍪 cookie validation
  // ==============================
  let cookie = '';
  if (cookieInput && COOKIES.includes(cookieInput.trim())) {
    cookie = cookieInput.trim();
  }

  // ==============================
  // 🔐 code accès validation
  // ==============================
  if (!codeAccesInput || codeAccesInput.trim() === '') {
    console.error('❌ Le code d\'accès est obligatoire.');
    process.exit(1);
  }

  const codeAcces = codeAccesInput.trim();

  // ==============================
  // 🔑 clé
  // ==============================
  const key = generateKey();

  // MongoDB
  const url = 'mongodb://127.0.0.1:27017';
  const dbName = 'myasdam';

  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  const users = db.collection('users');

  // Upsert super admin
  await users.updateOne(
    { email },
    {
      $set: {
        nom,
        prenom,
        email,
        password: hashedPassword,
        role: 'superadmin',

        contact,
        equipe,
        cookie,
        key,
        codeAcces
      }
    },
    { upsert: true }
  );

  console.log('✅ Super admin créé / mis à jour :', {
    nom,
    prenom,
    email,
    role: 'superadmin',
    contact,
    equipe,
    cookie,
    key,
    codeAcces
  });

  await client.close();
}

main().catch(err => {
  console.error('Erreur :', err);
  process.exit(1);
});
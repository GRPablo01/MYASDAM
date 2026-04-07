// create-superadmin-mongo.js
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const readline = require('readline');

// Interface pour le terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

async function main() {
  console.log('--- Création d\'un super admin MongoDB ---');

  const nom = await ask('Nom : ');
  const prenom = await ask('Prénom : ');
  const email = await ask('Email : ');
  const password = await ask('Mot de passe : ');

  rl.close();

  const hashedPassword = await bcrypt.hash(password, 12);

  // URL de connexion MongoDB (localhost par défaut)
  const url = 'mongodb://127.0.0.1:27017';
  const dbName = 'myasdam';

  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  const users = db.collection('users');

  // Upsert super admin
  const result = await users.updateOne(
    { email },
    {
      $set: {
        nom,
        prenom,
        email,
        password: hashedPassword,
        role: 'superadmin'
      }
    },
    { upsert: true }
  );

  console.log('✅ Super admin créé / mis à jour :', { nom, prenom, email, role: 'super admin' });

  await client.close();
}

main().catch(err => {
  console.error('Erreur :', err);
  process.exit(1);
});

const nodemailer = require('nodemailer');
require('dotenv').config(); // Toujours charger dotenv ici aussi

// 🚀 Crée le transporteur pour Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,      // ton email Gmail
    pass: process.env.MAIL_PASS       // mot de passe d'application Gmail (16 caractères, sans espaces)
  }
});

// 🔹 Fonction pour envoyer un mail
const sendMail = async (to, subject, text) => {
  console.log('Envoi mail à:', to);
  console.log('Sujet:', subject);
  
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text
    });
    console.log('✅ Mail envoyé:', info.response);
  } catch (error) {
    console.error('❌ Erreur envoi mail à', to, error.message);
  }
};

module.exports = { sendMail };
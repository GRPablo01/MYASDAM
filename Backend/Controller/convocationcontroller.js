const mongoose = require('mongoose');
const Convocation = require('../Schema/Convocations');
const nodemailer = require('nodemailer');

// ==============================
// CONFIG MAIL
// ==============================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// ==============================
// 🔑 Génération clé
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

// ==============================
// ✉️ TEMPLATE EMAIL
// ==============================
function generateEmailHTML(convocation, joueur, isDark = false) {
  // Palette de couleurs
  const colors = {
    // Backgrounds
    bgPrincipal: isDark ? '#121212' : '#F4F6F8',
    bgCard: isDark ? '#1E1E1E' : '#FFFFFF',
    bgCardSoft: isDark ? '#2A0F12' : '#FDEBEC',

    // Textes
    textPrincipal: isDark ? '#F5F5F5' : '#1A1A1A',
    textSecondaire: isDark ? '#B3B3B3' : '#555555',

    // Primary (Rouge)
    primary: '#C1121F',
    primaryHover: isDark ? '#FF4D4D' : '#E5383B',
    primarySoft: isDark ? '#2A0F12' : '#FDEBEC',

    // Validation
    bgOui: isDark ? '#14532d' : '#dcfce7',
    bgNon: isDark ? '#7f1d1d' : '#fee2e2',
    borderOui: '#22c55e',
    borderNon: '#ef4444',
    textOui: isDark ? '#86efac' : '#166534',
    textNon: isDark ? '#fca5a5' : '#991b1b',

    // UI
    borderNormal: isDark ? '1px solid #3A3A3A' : '1px solid #E5E7EB',
    iconColor: isDark ? '#CFCFCF' : '#444444'
  };

  const formattedDate = new Date(convocation.dateMatch).toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Convocation Match - ASDAM</title>
    <style>
      /* Reset */
      body, table, td, p, h1, h2, h3 { margin: 0; padding: 0; }
      
      /* Desktop/Laptop - Layout horizontal */
      @media screen and (min-width: 1024px) {
        .desktop-layout { display: table !important; width: 100% !important; }
        .desktop-left { display: table-cell !important; width: 45% !important; vertical-align: middle !important; padding-right: 30px !important; }
        .desktop-right { display: table-cell !important; width: 55% !important; vertical-align: middle !important; }
        .mobile-only { display: none !important; }
        .info-grid { display: table !important; width: 100% !important; }
        .info-row { display: table-row !important; }
        .info-cell { display: table-cell !important; padding: 8px 0 !important; border-bottom: ${colors.borderNormal} !important; }
        .info-label { width: 30% !important; color: ${colors.textSecondaire} !important; font-size: 12px !important; text-transform: uppercase !important; letter-spacing: 1px !important; }
        .info-value { width: 70% !important; color: ${colors.textPrincipal} !important; font-size: 16px !important; font-weight: 600 !important; }
      }
      
      /* Tablette et Mobile - Layout vertical */
      @media screen and (max-width: 1023px) {
        .desktop-layout { display: block !important; }
        .desktop-left { display: block !important; width: 100% !important; padding-right: 0 !important; padding-bottom: 25px !important; text-align: center !important; }
        .desktop-right { display: block !important; width: 100% !important; }
        .desktop-only { display: none !important; }
        .mobile-stack { display: block !important; margin-bottom: 15px !important; }
        .info-label { display: block !important; color: ${colors.textSecondaire} !important; font-size: 11px !important; text-transform: uppercase !important; letter-spacing: 1px !important; margin-bottom: 4px !important; }
        .info-value { display: block !important; color: ${colors.textPrincipal} !important; font-size: 15px !important; font-weight: 600 !important; padding-bottom: 12px !important; border-bottom: ${colors.borderNormal} !important; margin-bottom: 12px !important; }
      }
      
      /* Boutons responsive */
      @media screen and (max-width: 480px) {
        .btn-stack { display: block !important; width: 100% !important; margin-bottom: 12px !important; }
        .btn-full { display: block !important; text-align: center !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:${colors.bgPrincipal}; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    
    <!-- Container principal -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${colors.bgPrincipal}; padding:40px 20px;">
      <tr>
        <td align="center">
          
          <!-- Card principale -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="700" style="max-width:700px; background:${colors.bgCard}; border-radius:16px; overflow:hidden; border:${colors.borderNormal};">
            
            <!-- Header -->
            <tr>
              <td style="background:${colors.primary}; padding:30px; text-align:center; border-bottom: 3px solid ${colors.primaryHover};">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                  <tr>
                    <td style="padding-right:15px;">
  <img src="https://www.asdam.fr/nouveau-logo-de-lasdam/" alt="MyAsdam" width="50" height="50" style="display:block;">
</td>
                    <td style="text-align:left;">
                      <h1 style="color:#FFFFFF; margin:0; font-size:26px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">CONVOCATION</h1>
                      <p style="color:#FFFFFF; margin:5px 0 0 0; font-size:13px; opacity:0.9; letter-spacing:1px;">Match Officiel</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Contenu - Layout Desktop Gauche/Droite -->
            <tr>
              <td style="padding:40px 30px;">
                
                <div class="desktop-layout">
                  
                  <!-- COLONNE GAUCHE : Joueur + Message -->
                  <div class="desktop-left">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background:${colors.primarySoft}; border-radius:12px; padding:25px; border-left:4px solid ${colors.primary};">
                          
                          <!-- Avatar/Initiales -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin-bottom:15px;">
  <tr>
    <td style="background:${colors.primary}; border-radius:50%; width:70px; height:70px; text-align:center; vertical-align:middle;">
      <span style="color:#FFFFFF; font-size:24px; font-weight:700; letter-spacing:1px; text-transform:uppercase; line-height:70px;">
        ${(joueur.prenom?.charAt(0) || '')}${joueur.nom?.charAt(0) || ''}
      </span>
    </td>
  </tr>
</table>
                          <p style="color:${colors.textSecondaire}; font-size:12px; text-transform:uppercase; letter-spacing:1px; text-align:center; margin:0 0 8px 0;">Joueur convoqué</p>
                          <p style="color:${colors.textPrincipal}; font-size:22px; font-weight:700; text-align:center; margin:0 0 5px 0;">${joueur.prenom || ''} ${joueur.nom}</p>
                          
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:20px; border-top:${colors.borderNormal}; padding-top:15px;">
                            <tr>
                              <td style="text-align:center;">
                                <p style="color:${colors.textSecondaire}; font-size:14px; line-height:1.6; margin:0;">
                                  Tu es sélectionné pour le prochain match. Consulte les détails et confirme ta présence.
                                </p>
                              </td>
                            </tr>
                          </table>
                          
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- COLONNE DROITE : Détails du match -->
                  <div class="desktop-right">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td>
                          
                          <!-- Titre section -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:20px;">
                            <tr>
                              <td style="border-bottom:2px solid ${colors.primary}; padding-bottom:10px;">
                                <p style="color:${colors.primary}; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin:0;">
                                  <img src="https://cdn-icons-png.flaticon.com/512/33/33736.png" alt="Match" width="16" height="16" style="vertical-align:middle; margin-right:8px; opacity:0.8;">
                                  Détails du Match
                                </p>
                              </td>
                            </tr>
                          </table>

                          <!-- Infos en grille desktop / stack mobile -->
                          <div class="info-grid">
                            
                            <!-- Match -->
                            <div class="info-row mobile-stack">
                              <div class="info-cell info-label">Match</div>
                              <div class="info-cell info-value">${convocation.match}</div>
                            </div>
                            
                            <!-- Équipe -->
                            <div class="info-row mobile-stack">
                              <div class="info-cell info-label">Équipe</div>
                              <div class="info-cell info-value">${convocation.equipe}</div>
                            </div>
                            
                            <!-- Lieu -->
                            <div class="info-row mobile-stack">
                              <div class="info-cell info-label">Lieu</div>
                              <div class="info-cell info-value">${convocation.lieu}</div>
                            </div>
                            
                            <!-- Date -->
                            <div class="info-row mobile-stack">
                              <div class="info-cell info-label">Date & Heure</div>
                              <div class="info-cell info-value" style="border-bottom:none !important; margin-bottom:0 !important; padding-bottom:0 !important;">${formattedDate}</div>
                            </div>
                            
                          </div>

                        </td>
                      </tr>
                    </table>
                  </div>
                  
                </div>

              </td>
            </tr>

            <!-- Section Confirmation -->
<tr>
  <td style="padding:0 30px 30px 30px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="background:${colors.bgCardSoft}; border-radius:12px; padding:30px; border:${colors.borderNormal}; text-align:center;">
          
          <!-- Message principal -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin-bottom:20px;">
            <tr>
              <td style="background:${colors.primary}; border-radius:50%; padding:12px;">
                <img src="https://cdn-icons-png.flaticon.com/512/1827/1827301.png" alt="Info" width="24" height="24" style="filter: brightness(0) invert(1); display:block;">
              </td>
            </tr>
          </table>
          
          <p style="color:${colors.textPrincipal}; font-size:18px; margin:0 0 12px 0; font-weight:700;">
            Merci de confirmer ta présence
          </p>
          
          <p style="color:${colors.textSecondaire}; font-size:14px; line-height:1.6; margin:0 0 25px 0;">
            Va sur le site pour confirmer ta présence et accéder à tous les détails du match.
          </p>

          <!-- Bouton principal -->
          <a href="http://192.168.1.43:3000/convocation/${joueur.key}" 
             style="display:inline-block; background:${colors.primary}; color:#FFFFFF; text-decoration:none; padding:16px 40px; border-radius:10px; font-weight:700; font-size:16px; text-transform:uppercase; letter-spacing:1px; border:2px solid ${colors.primaryHover}; box-shadow:0 4px 15px ${isDark ? 'rgba(193,18,31,0.4)' : 'rgba(193,18,31,0.3)'};">
            <img src="https://cdn-icons-png.flaticon.com/512/44/44386.png" alt="Site" width="18" height="18" style="vertical-align:middle; margin-right:10px; filter: brightness(0) invert(1);">
            Accéder au site
          </a>

        </td>
      </tr>
    </table>
  </td>
</tr>

            <!-- Footer -->
            <tr>
              <td style="background:${isDark ? '#1E1E1E' : '#F9FAFB'}; padding:25px; text-align:center; border-top:${colors.borderNormal};">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin-bottom:10px;">
                  <tr>
                    <td style="padding-right:15px;">
  <img src="https://www.asdam.fr/nouveau-logo-de-lasdam/" alt="MyAsdam" width="50" height="50" style="display:block;">
</td>
                  </tr>
                </table>
                <p style="color:${colors.textPrincipal}; margin:0; font-size:16px; font-weight:700;">MyAsdam</p>
                <p style="color:${colors.textSecondaire}; margin:8px 0 0 0; font-size:12px; letter-spacing:1px;">Message automatique - Ne pas répondre</p>
                <p style="color:${colors.textSecondaire}; margin:15px 0 0 0; font-size:11px; opacity:0.7;">
                  © ${new Date().getFullYear()} MyAsdam. Tous droits réservés.
                </p>
              </td>
            </tr>

          </table>
          
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

// ============================
// Créer une convocation + MAIL
// ============================
exports.createConvocation = async (req, res) => {
  try {
    let { joueurs, joueursDetails, equipe, match, dateMatch, lieu } = req.body;

    console.log("📩 Données reçues :", req.body);

    if ((!joueurs && !joueursDetails) || !equipe || !match || !dateMatch || !lieu) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    // ============================
    // PRIORITÉ joueursDetails
    // ============================
    if (joueursDetails && Array.isArray(joueursDetails)) {
      joueurs = joueursDetails.map(j => {
        if (!j.email) throw new Error(`Email manquant pour ${j.nom}`);

        return {
          nom: j.nom,
          prenom: j.prenom,
          present: 'non_repondu',
          key: generateKey(),
          email: j.email
        };
      });
    }

    // ============================
    // Création
    // ============================
    const convocation = new Convocation({
      joueurs,
      equipe,
      match,
      dateMatch,
      lieu
    });

    await convocation.save();

    console.log('💾 Convocation créée');

    // ============================
    // ✉️ ENVOI DES EMAILS
    // ============================
    for (const joueur of joueurs) {
      if (!joueur.email) continue;

      const mailOptions = {
        from: `"MyAsdam ⚽" <${process.env.EMAIL_USER}>`,
        to: joueur.email,
        subject: `📣 Convocation - ${match}`,
        html: generateEmailHTML(convocation, joueur)
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Mail envoyé à ${joueur.email}`);
      } catch (err) {
        console.error(`❌ Erreur envoi mail à ${joueur.email}`, err.message);
      }
    }

    res.status(201).json(convocation);

  } catch (error) {
    console.error("❌ Erreur:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ============================
// GET ALL
// ============================
exports.getAllConvocations = async (req, res) => {
  try {
    const convocations = await Convocation.find().sort({ dateMatch: 1 });
    res.json(convocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// GET BY KEY
// ============================
exports.getConvocationByKey = async (req, res) => {
  try {
    const convocation = await Convocation.findOne({ key: req.params.key });

    if (!convocation) {
      return res.status(404).json({ message: 'Non trouvée' });
    }

    res.json(convocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// UPDATE
// ============================
exports.updateConvocationByKey = async (req, res) => {
  try {
    const convocation = await Convocation.findOneAndUpdate(
      { key: req.params.key },
      req.body,
      { new: true }
    );

    res.json(convocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// DELETE
// ============================
exports.deleteConvocationByKey = async (req, res) => {
  try {
    await Convocation.findOneAndDelete({ key: req.params.key });
    res.json({ message: 'Supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// UPDATE STATUT JOUEUR
// ============================
exports.updateStatutJoueurByKey = async (req, res) => {
  try {
    const { convocationId, joueurKey } = req.params;
    const { present } = req.body;

    const convocation = await Convocation.findById(convocationId);

    const joueur = convocation.joueurs.find(j => j.key === joueurKey);

    joueur.present = present;

    await convocation.save();

    res.json({ joueur });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ======================================================
// MESSAGE CONTROLLER (DB + EMAIL + KEY SYSTEM SAFE)
// ======================================================

const Message = require('../Schema/message');
const User = require('../Schema/User');
const nodemailer = require('nodemailer');


// ======================================================
// CONFIG EMAIL
// ======================================================

const transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});


// ======================================================
// TEMPLATE EMAIL MESSAGE
// ======================================================

function generateMessageEmailHTML(message, expediteur, destinataire) {

    return `
    <!DOCTYPE html>
    <html lang="fr">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Nouveau message</title>
    </head>

    <body style="
        margin:0;
        padding:0;
        background:#f4f4f4;
        font-family:Arial, Helvetica, sans-serif;
    ">

        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
            <tr>
                <td align="center">

                    <!-- CARD -->
                    <table width="650" cellpadding="0" cellspacing="0" style="
                        max-width:650px;
                        background:#ffffff;
                        border-radius:16px;
                        overflow:hidden;
                        box-shadow:0 5px 20px rgba(0,0,0,0.08);
                    ">

                        <!-- HEADER -->
                        <tr>
                            <td style="
                                background:#c1121f;
                                padding:35px;
                                text-align:center;
                            ">

                                <h1 style="
                                    color:#ffffff;
                                    margin:0;
                                    font-size:28px;
                                    letter-spacing:1px;
                                ">
                                    📩 Nouveau Message
                                </h1>

                                <p style="
                                    color:#ffffff;
                                    margin-top:10px;
                                    opacity:0.9;
                                    font-size:14px;
                                ">
                                    Messagerie MyAsdam
                                </p>

                            </td>
                        </tr>

                        <!-- CONTENT -->
                        <tr>
                            <td style="padding:40px;">

                                <!-- EXPEDITEUR -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="
                                    background:#fdebec;
                                    border-left:5px solid #c1121f;
                                    border-radius:12px;
                                    padding:25px;
                                    margin-bottom:30px;
                                ">

                                    <tr>
                                        <td align="center">

                                            <div style="
                                                width:80px;
                                                height:80px;
                                                background:#c1121f;
                                                border-radius:50%;
                                                line-height:80px;
                                                text-align:center;
                                                margin:0 auto 15px auto;
                                                color:#ffffff;
                                                font-size:28px;
                                                font-weight:bold;
                                            ">
                                                ${expediteur.prenom?.charAt(0) || ''}
                                                ${expediteur.nom?.charAt(0) || ''}
                                            </div>

                                            <p style="
                                                margin:0;
                                                color:#666;
                                                font-size:13px;
                                                text-transform:uppercase;
                                                letter-spacing:1px;
                                            ">
                                                Expéditeur
                                            </p>

                                            <h2 style="
                                                margin:10px 0 0 0;
                                                color:#111;
                                                font-size:24px;
                                            ">
                                                ${expediteur.prenom} ${expediteur.nom}
                                            </h2>

                                        </td>
                                    </tr>

                                </table>

                                <!-- MESSAGE -->
                                <table width="100%" cellpadding="0" cellspacing="0">

                                    <tr>
                                        <td>

                                            <p style="
                                                color:#555;
                                                font-size:15px;
                                                margin-bottom:12px;
                                                font-weight:bold;
                                            ">
                                                Message reçu :
                                            </p>

                                            <div style="
                                                background:#f8f9fa;
                                                border:1px solid #e5e7eb;
                                                border-radius:12px;
                                                padding:25px;
                                                color:#222;
                                                font-size:16px;
                                                line-height:1.7;
                                                white-space:pre-wrap;
                                            ">
                                                ${message}
                                            </div>

                                        </td>
                                    </tr>

                                </table>

                                <!-- BUTTON -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:35px;">

                                    <tr>
                                        <td align="center">

                                            <a href="http://localhost:4200/message"
                                               style="
                                                display:inline-block;
                                                background:#c1121f;
                                                color:#ffffff;
                                                text-decoration:none;
                                                padding:16px 35px;
                                                border-radius:10px;
                                                font-size:15px;
                                                font-weight:bold;
                                                letter-spacing:1px;
                                            ">
                                                Ouvrir la messagerie
                                            </a>

                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>

                        <!-- FOOTER -->
                        <tr>
                            <td style="
                                background:#f9fafb;
                                padding:25px;
                                text-align:center;
                                border-top:1px solid #e5e7eb;
                            ">

                                <p style="
                                    margin:0;
                                    font-size:16px;
                                    font-weight:bold;
                                    color:#111;
                                ">
                                    MyAsdam
                                </p>

                                <p style="
                                    margin-top:8px;
                                    font-size:12px;
                                    color:#777;
                                ">
                                    Message automatique - Ne pas répondre
                                </p>

                                <p style="
                                    margin-top:15px;
                                    font-size:11px;
                                    color:#999;
                                ">
                                    © ${new Date().getFullYear()} MyAsdam
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


// ======================================================
// ENRICH MESSAGE
// ======================================================

const enrichMessage = async (msg) => {

    return {

        _id: msg._id,

        texte: msg.texte,

        createdAt: msg.createdAt,

        lu: msg.lu || false,

        type: msg.type || 'texte',

        fichierUrl: msg.fichierUrl || null,

        expediteur: {

            key: msg.expediteurId,

            nom: msg.expediteurNom || '',

            prenom: msg.expediteurPrenom || ''
        },

        destinataire: {

            key: msg.destinataireId,

            nom: msg.destinataireNom || '',

            prenom: msg.destinatairePrenom || ''
        }
    };
};


// ======================================================
// ENVOYER MESSAGE + EMAIL
// ======================================================

exports.envoyerMessage = async (req, res) => {

    try {

        const {

            expediteurId,
            destinataireId,
            texte

        } = req.body;

        // ==================================================
        // VALIDATION
        // ==================================================

        if (!expediteurId || !destinataireId || !texte) {

            return res.status(400).json({

                message: 'Champs manquants'
            });
        }

        // ==================================================
        // USERS
        // ==================================================

        const [exp, dest] = await Promise.all([

            User.findOne({ key: expediteurId }),

            User.findOne({ key: destinataireId })
        ]);

        if (!exp || !dest) {

            return res.status(404).json({

                message: 'Utilisateur introuvable'
            });
        }

        // ==================================================
        // SAVE MESSAGE
        // ==================================================

        const nouveauMessage = await Message.create({

            // ==============================================
            // EXPEDITEUR
            // ==============================================

            expediteurId: exp.key,

            expediteurNom: exp.nom,

            expediteurPrenom: exp.prenom,

            // ==============================================
            // DESTINATAIRE
            // ==============================================

            destinataireId: dest.key,

            destinataireNom: dest.nom,

            destinatairePrenom: dest.prenom,

            // ==============================================
            // MESSAGE
            // ==============================================

            texte
        });

        console.log('💾 Message enregistré');

        // ==================================================
        // EMAIL
        // ==================================================

        if (

            dest.email &&
            process.env.MAIL_USER &&
            process.env.MAIL_PASS

        ) {

            try {

                await transporter.sendMail({

                    from: `"MyAsdam 📩" <${process.env.MAIL_USER}>`,

                    to: dest.email,

                    subject:
                        `📩 Nouveau message de ${exp.prenom} ${exp.nom}`,

                    html: generateMessageEmailHTML(
                        texte,
                        exp,
                        dest
                    )
                });

                console.log(`📧 Mail envoyé à ${dest.email}`);

            } catch (mailError) {

                console.error(
                    `❌ Erreur mail ${dest.email}`,
                    mailError.message
                );
            }
        }

        // ==================================================
        // RESPONSE
        // ==================================================

        const response = await enrichMessage(nouveauMessage);

        return res.status(201).json(response);

    } catch (error) {

        console.error('❌ MESSAGE ERROR:', error);

        return res.status(500).json({

            message: 'Erreur serveur',

            error: error.message
        });
    }
};


// ======================================================
// CONVERSATION
// ======================================================

exports.recupererConversation = async (req, res) => {

    try {

        const { user1, user2 } = req.params;

        const messages = await Message.find({

            $or: [

                {
                    expediteurId: user1,
                    destinataireId: user2
                },

                {
                    expediteurId: user2,
                    destinataireId: user1
                }
            ]
        })

        .sort({ createdAt: 1 });

        const enriched = await Promise.all(

            messages.map(msg => enrichMessage(msg))
        );

        return res.json(enriched);

    } catch (error) {

        console.error('Erreur conversation:', error);

        return res.status(500).json({

            message: 'Erreur serveur',

            error: error.message
        });
    }
};


// ======================================================
// DERNIER MESSAGE
// ======================================================

exports.dernierMessage = async (req, res) => {

    try {

        const { user1, user2 } = req.params;

        const message = await Message.findOne({

            $or: [

                {
                    expediteurId: user1,
                    destinataireId: user2
                },

                {
                    expediteurId: user2,
                    destinataireId: user1
                }
            ]
        })

        .sort({ createdAt: -1 });

        if (!message) {

            return res.json(null);
        }

        const response = await enrichMessage(message);

        return res.json(response);

    } catch (error) {

        console.error('Erreur dernierMessage:', error);

        return res.status(500).json({

            message: 'Erreur serveur',

            error: error.message
        });
    }
};


exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.supprimerMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({
                message: "Message introuvable"
            });
        }

        return res.status(200).json({
            message: "Message supprimé avec succès"
        });

    } catch (error) {
        console.error('❌ DELETE MESSAGE ERROR:', error);

        return res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });
    }
};
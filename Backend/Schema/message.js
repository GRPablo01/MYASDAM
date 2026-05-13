const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        // ======================================================
        // EXPÉDITEUR
        // ======================================================

        expediteurId: {
            type: String,
            required: [true, 'L’expéditeur est obligatoire'],
            trim: true,
            index: true
        },

        expediteurNom: {
            type: String,
            required: true,
            trim: true
        },

        expediteurPrenom: {
            type: String,
            required: true,
            trim: true
        },

        // ======================================================
        // DESTINATAIRE
        // ======================================================

        destinataireId: {
            type: String,
            required: [true, 'Le destinataire est obligatoire'],
            trim: true,
            index: true
        },

        destinataireNom: {
            type: String,
            required: true,
            trim: true
        },

        destinatairePrenom: {
            type: String,
            required: true,
            trim: true
        },

        // ======================================================
        // MESSAGE
        // ======================================================

        texte: {
            type: String,
            required: [true, 'Le message est obligatoire'],
            trim: true,
            minlength: [1, 'Le message est vide'],
            maxlength: [5000, 'Le message est trop long']
        },

        // ======================================================
        // OPTIONS
        // ======================================================

        lu: {
            type: Boolean,
            default: false
        },

        type: {
            type: String,
            enum: ['texte', 'image', 'fichier'],
            default: 'texte'
        },

        fichierUrl: {
            type: String,
            default: null
        },

        supprimeParExpediteur: {
            type: Boolean,
            default: false
        },

        supprimeParDestinataire: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// ======================================================
// INDEX POUR LES CONVERSATIONS
// ======================================================

messageSchema.index({
    expediteurId: 1,
    destinataireId: 1,
    createdAt: -1
});

// ======================================================
// MÉTHODE : MESSAGE VISIBLE
// ======================================================

messageSchema.methods.estVisiblePour = function (userId) {

    if (
        this.expediteurId === userId &&
        this.supprimeParExpediteur
    ) {
        return false;
    }

    if (
        this.destinataireId === userId &&
        this.supprimeParDestinataire
    ) {
        return false;
    }

    return true;
};

// ======================================================
// EXPORT
// ======================================================

module.exports = mongoose.model('Message', messageSchema);
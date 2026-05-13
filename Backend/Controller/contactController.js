const User = require('../Schema/User');

// =====================================================
// ➕ AJOUT CONTACT
// =====================================================
exports.addContact = async (req, res) => {

    try {

        const { userId, contactId } = req.body;

        // console.log('BODY:', req.body);

        // =========================
        // VALIDATION
        // =========================
        if (!userId || !contactId) {

            return res.status(400).json({
                message: 'userId ou contactId manquant'
            });
        }

        // =========================
        // USER
        // =========================
        const user = await User.findOne({ key: userId });

        if (!user) {

            return res.status(404).json({
                message: 'User introuvable'
            });
        }

        // =========================
        // INIT CONTACT
        // =========================
        if (!Array.isArray(user.contact)) {
            user.contact = [];
        }

        // =========================
        // ÉVITER DOUBLON
        // =========================
        const alreadyExist = user.contact.some(
            id => String(id) === String(contactId)
        );

        if (!alreadyExist) {
            user.contact.push(contactId);
        }

        // =========================
        // SAVE
        // =========================
        await user.save();

        res.status(200).json({
            message: 'Contact ajouté',
            contact: user.contact
        });

    } catch (error) {

        console.error('❌ ADD CONTACT ERROR :', error);

        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};


// =====================================================
// 📥 GET CONTACTS
// =====================================================
exports.getContacts = async (req, res) => {

    try {

        const user = await User.findOne({
            key: req.params.userId
        });

        if (!user) {

            return res.status(404).json({
                message: 'User introuvable'
            });
        }

        const contacts = await User.find({
            key: { $in: user.contact || [] }
        });

        res.status(200).json(contacts);

    } catch (error) {

        console.error('❌ GET CONTACTS ERROR :', error);

        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};


// =====================================================
// 🗑️ REMOVE CONTACT
// =====================================================
exports.removeContact = async (req, res) => {

    try {

        const { userId, contactId } = req.body;

        const user = await User.findOne({
            key: userId
        });

        if (!user) {

            return res.status(404).json({
                message: 'User introuvable'
            });
        }

        user.contact = (user.contact || []).filter(
            id => String(id) !== String(contactId)
        );

        await user.save();

        res.status(200).json({
            message: 'Contact supprimé',
            contact: user.contact
        });

    } catch (error) {

        console.error('❌ REMOVE CONTACT ERROR :', error);

        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};
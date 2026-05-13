const express = require('express');
const router = express.Router();

const User = require('../Schema/User');

const {
  registerUser
} = require('../Controller/registerController');

const {
  loginUser,
  updateCookieByKey
} = require('../Controller/loginController');


// ======================================================
// AUTH
// ======================================================

// 🔥 REGISTER
router.post('/register', registerUser);

// 🔥 LOGIN
router.post('/login', loginUser);

// 🔥 UPDATE COOKIE
router.put('/cookie/:key', updateCookieByKey);


// ======================================================
// GET ALL USERS
// ======================================================

router.get('/users', async (req, res) => {

  try {

    const users = await User.find().select('-password');

    res.status(200).json(users);

  } catch (error) {

    console.error('❌ GET USERS ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }

});


// ======================================================
// GET USER BY ID
// ======================================================

router.get('/users/:id', async (req, res) => {

  try {

    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      });
    }

    res.status(200).json(user);

  } catch (error) {

    console.error('❌ GET USER ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }

});


// ======================================================
// UPDATE USER
// ======================================================

router.put('/users/:id', async (req, res) => {

  try {

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!updatedUser) {

      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      });

    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour',
      user: updatedUser
    });

  } catch (error) {

    console.error('❌ UPDATE USER ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }

});


// ======================================================
// DELETE USER
// ======================================================

router.delete('/users/:id', async (req, res) => {

  try {

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {

      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      });

    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé'
    });

  } catch (error) {

    console.error('❌ DELETE USER ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }

});


// ======================================================
// SEARCH USER BY KEY
// ======================================================

router.get('/key/:key', async (req, res) => {

  try {

    const user = await User.findOne({
      key: req.params.key
    }).select('-password');

    if (!user) {

      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      });

    }

    res.status(200).json(user);

  } catch (error) {

    console.error('❌ SEARCH KEY ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }

});


// ======================================================
// EXPORT
// ======================================================

module.exports = router;
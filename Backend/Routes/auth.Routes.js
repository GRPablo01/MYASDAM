const express = require('express');
const router = express.Router();

const { registerUser } = require('../Controller/registerController');
const { loginUser, updateCookieByKey } = require('../Controller/loginController');
const User = require('../Schema/User');

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/cookie/:key', updateCookieByKey);

// 🔥 GET users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔥 UPDATE USER
router.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

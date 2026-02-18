const express = require('express');
const router = express.Router();

const { registerUser } = require('../Controller/registerController');
const { loginUser } = require('../Controller/loginController');

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;

const express = require('express');
const router = express.Router();

const { registerUser } = require('../Controller/registerController');
const { loginUser } = require('../Controller/loginController');
const { updateCookieByKey } = require('../Controller/loginController');

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// PUT pour mettre à jour le cookie via n'importe quelle key
router.put('/cookie/:key', updateCookieByKey);

module.exports = router;

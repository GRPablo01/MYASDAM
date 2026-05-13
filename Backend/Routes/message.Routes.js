const express = require('express');
const router = express.Router();

const {
    envoyerMessage,
    recupererConversation,
    dernierMessage,
    getAllMessages,
    supprimerMessage 
} = require('../Controller/message.controller');

router.get('/', getAllMessages);

router.delete('/:id', supprimerMessage);

router.post('/', envoyerMessage);

router.get('/conversation/:user1/:user2', recupererConversation);

router.get('/dernier/:user1/:user2', dernierMessage);

module.exports = router;
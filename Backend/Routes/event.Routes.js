// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../Controller/eventController');

router.post('/create', eventController.createEvent);
router.get('/', eventController.getEvents);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;

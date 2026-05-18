const express = require('express');
const router = express.Router();
const eventController = require('../Controller/eventController');

// CREATE
router.post('/', eventController.createEvent);

// READ
router.get('/', eventController.getEvents);

// UPDATE
router.put('/:id', eventController.updateEvent);

// DELETE
router.delete('/:id', eventController.deleteEvent);

// READ ONE
router.get('/:id', eventController.getEventById);

module.exports = router;
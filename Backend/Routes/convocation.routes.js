const express = require('express');
const router = express.Router();
const controller = require('../Controller/convocationcontroller');

// CRUD
router.post('/', controller.createConvocation);
router.get('/', controller.getAllConvocations);
router.get('/:id', controller.getConvocationById);
router.put('/:id', controller.updateConvocation);
router.delete('/:id', controller.deleteConvocation);

module.exports = router;

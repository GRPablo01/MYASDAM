const express = require('express');
const router = express.Router();
const controller = require('../Controller/convocationcontroller');

// ============================
// 🔹 CRUD pour les convocations (identifiant = key)
// ============================

// Créer une convocation
router.post('/', controller.createConvocation);

// Récupérer toutes les convocations
router.get('/', controller.getAllConvocations);

// Récupérer une convocation par key
router.get('/:key', controller.getConvocationByKey);

// Modifier une convocation par key
router.put('/:key', controller.updateConvocationByKey);

// Supprimer une convocation par key
router.delete('/:key', controller.deleteConvocationByKey);

// 🔹 Mettre à jour le statut d’un joueur
// Exemple URL Angular: PUT http://localhost:3000/api/convocations/69cd782faa8754e511963c67/joueur/76714KPGDF
router.put('/:convocationId/joueur/:joueurKey', controller.updateStatutJoueurByKey);

module.exports = router;
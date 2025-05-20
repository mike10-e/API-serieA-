const express = require('express');
const router = express.Router();
const PartitaController = require('../controllers/partita.controller');

router.get('/:squadre', PartitaController.getPartita );

module.exports = router;

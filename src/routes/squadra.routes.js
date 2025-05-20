const express = require('express');
const router = express.Router();
const squadraController = require('../controllers/squadra.controller');

router.get('/:nomeSquadra', squadraController.getGiocatoriPerRuolo);

module.exports = router;

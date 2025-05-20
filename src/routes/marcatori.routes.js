const express = require('express');
const router = express.Router();
const marcatoriController = require('../controllers/marcatori.controller');

router.get('/marcatori', marcatoriController.getMarcatori);
router.get('/assist', marcatoriController.getAssist);

module.exports = router;

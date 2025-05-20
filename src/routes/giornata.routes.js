
const express = require('express');
const router = express.Router();
const giornataController = require('../controllers/giornata.controller');

router.get('/:giornata', giornataController.getPartiteByGiornata);

module.exports = router;

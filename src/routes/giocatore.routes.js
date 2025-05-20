    const express = require('express');
    const router = express.Router();
    const giocatoreController = require('../controllers/giocatore.controller');

    router.get('/', giocatoreController.getGiocatore);

    module.exports = router;

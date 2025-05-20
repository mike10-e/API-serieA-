const express = require('express');
const router = express.Router();
const { importProbabilita } = require('../controllers/probabilità.controller');

// GET /api/probabilita/import
router.get('/import', importProbabilita);

module.exports = router;

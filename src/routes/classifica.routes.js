const express = require('express');
const router = express.Router();
const { calcolaClassifica } = require('../controllers/classifica.controller');

router.get('/', async (req, res) => {
  try {
    const classifica = await calcolaClassifica();
    res.json(classifica);
  } catch (err) {
    console.error('❌ Errore nella classifica:', err);  // 👈 Aggiungi questo
    res.status(500).json({ errore: 'Errore nel calcolo classifica' });
  }
});

module.exports = router;

const db = require('../models');

exports.getGiocatoriPerRuolo = async (req, res) => {
     console.log('req.params:', req.params); // 👈 logga tutto
  const nomeSquadra = req.params.nomeSquadra;

  try {
    console.log('Param squadra:', nomeSquadra);

    const squadra = await db.Squadra.findOne({ where: { nome: nomeSquadra } });

    if (!squadra) {
      return res.status(404).json({ error: 'Squadra non trovata' });
    }

    const giocatori = await db.Giocatore.findAll({
      where: { id_squadra: squadra.id },
      attributes: ['nome', 'cognome', 'ruolo']
    });

    const giocatoriPerRuolo = {};

    giocatori.forEach(giocatore => {
      const ruolo = giocatore.ruolo.toUpperCase();
      if (!giocatoriPerRuolo[ruolo]) {
        giocatoriPerRuolo[ruolo] = [];
      }
      giocatoriPerRuolo[ruolo].push(`${giocatore.nome} ${giocatore.cognome}`);
    });

    const response = {
      [nomeSquadra]: giocatoriPerRuolo
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il recupero dei giocatori' });
  }
};

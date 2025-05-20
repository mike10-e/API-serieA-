const db = require('../models');
const Giocatore = db.Giocatore;
const Squadra = db.Squadra;
const Evento = db.Evento;
const { Op } = require('sequelize');

exports.getGiocatore = async (req, res) => {
  const { nome, cognome } = req.query;

  try {
    const giocatori = await Giocatore.findAll({
      where: {
        nome: nome,
        cognome: cognome
      },
      include: [
        {
          model: db.Squadra,
          attributes: ['nome']
        },
        {
          model: db.Evento, // usa `as: 'eventi'` se hai definito alias nel modello
          attributes: ['tipo'],
          // as: 'eventi' // <-- se serve
        }
      ]
      
    });

    if (!giocatori || giocatori.length === 0) {
      return res.status(404).json({ messaggio: "Nessun giocatore trovato" });
    }

    // Mappiamo i dati con statistiche
    const risultato = giocatori.map(giocatore => {
      const eventi = giocatore.Eventos || []; // <-- minuscolo e plurale, come Sequelize genera di default

      const stats = {
        gol: 0,
        assist: 0,
        cartellini_gialli: 0,
        cartellini_rossi: 0,
      };

      eventi.forEach(evento => {
        const tipo = evento.tipo.toLowerCase().trim();
        if (tipo.includes('gol')) stats.gol++;
        else if (tipo.includes('assist')) stats.assist++;
        else if (tipo.includes('cartellino giallo')) stats.cartellini_gialli++;
        else if (tipo.includes('cartellino rosso')) stats.cartellini_rossi++;
      });

      return {
        nome: giocatore.nome,
        cognome: giocatore.cognome,
        squadra: giocatore.Squadra?.nome || null,
        età: giocatore.età,
        nazionalità: giocatore.nazionalità,
        statistiche: stats
      };
    });


    res.json(risultato);
  } catch (error) {
    res.status(500).json({ errore: "Errore durante la ricerca", dettagli: error.message });
  }
};

const { Partita, Squadra, Evento, Giocatore, Probabilita } = require('../models');
const { calcolaClassifica } = require('../controllers/classifica.controller'); // importa la funzione correttamente

exports.getPartita = async (req, res) => {
  try {
    const [squadraCasaNome, squadraTrasfertaNome] = req.params.squadre.split('-');

    // Trova le squadre
    const squadraCasa = await Squadra.findOne({ where: { nome: squadraCasaNome } });
    const squadraTrasferta = await Squadra.findOne({ where: { nome: squadraTrasfertaNome } });

    if (!squadraCasa || !squadraTrasferta) {
      return res.status(404).json({ error: 'Squadra non trovata' });
    }

    const idCasa = squadraCasa.id;
    const idTrasferta = squadraTrasferta.id;

    const partita = await Partita.findOne({
      where: {
        id_squadra_casa: idCasa,
        id_squadra_trasferta: idTrasferta,
      },
      include: [
        { model: Squadra, as: 'squadraCasa' },
        { model: Squadra, as: 'squadraTrasferta' },
        {
          model: Evento,
          include: [{
            model: Giocatore,
            include: [{ model: Squadra }]
          }]
        }
      ]
    });

    if (!partita) {
      return res.status(404).json({ error: 'Partita non trovata' });
    }

    const response = {
      id: partita.id,
      squadraCasa: partita.squadraCasa.nome,
      squadraTrasferta: partita.squadraTrasferta.nome,
      risultato: {
        golCasa: partita.golCasa,
        golTrasferta: partita.golTrasferta,
      }
    };

    if (partita.golCasa === null || partita.golTrasferta === null) {
      const classifica = await calcolaClassifica();
      const statsCasa = classifica.find(s => s.squadraId === squadraCasa.id);
      const statsTrasferta = classifica.find(s => s.squadraId === squadraTrasferta.id);

      response.statistiche = {
        squadraCasa: statsCasa || {},
        squadraTrasferta: statsTrasferta || {}
      };

      const probabilita = await Probabilita.findOne({
        where: { id_partita: partita.id }
      });

      if (probabilita) {
        response.probabilita = {
          1: probabilita.percentualeVittoria,
          2: probabilita.percentualeSconfitta,
          x: probabilita.percentualePareggio,
        };
      }

    } else {
      response.eventi = partita.Eventos.map(e => ({
        minuto: e.minuto,
        tipoEvento: e.tipo,
        nomeAutore: e.Giocatore?.nome,
        cognomeAutore: e.Giocatore?.cognome,
        squadra: e.Giocatore?.Squadra?.nome
      }));
    }

    res.json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore server' });
  }
};

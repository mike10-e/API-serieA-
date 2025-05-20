const db = require('../models');
const Giocatore = db.Giocatore;
const Evento = db.Evento;
const Squadra = db.Squadra;

exports.getMarcatori = async (req, res) => {
  try {
    const marcatori = await Evento.findAll({
      where: { tipo: 'gol' },
        attributes: [
        'id_giocatore',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('Evento.id')), 'gol_totali']  // <-- specifica la tabella
        ],
      group: ['id_giocatore'],
      order: [[db.Sequelize.literal('gol_totali'), 'DESC']],
      include: [{
        model: Giocatore,
        attributes: ['nome', 'cognome'],
        include: [{
          model: Squadra,
          attributes: ['nome']
        }]
      }]
    });

    const classifica = marcatori.map(m => ({
      id: m.id_giocatore,
      nome: m.Giocatore.nome,
      cognome: m.Giocatore.cognome,
      squadra: m.Giocatore.Squadra?.nome || null,
      gol: parseInt(m.get('gol_totali'), 10)
    }));

    res.json(classifica);
  } catch (error) {
    res.status(500).json({ errore: 'Errore durante il calcolo della classifica marcatori', dettagli: error.message });
  }
};

exports.getAssist = async (req, res) => {
  try {
    const assist = await Evento.findAll({
      where: { tipo: 'assist' },
      attributes: [
        'id_giocatore',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('Evento.id')), 'assist_totali']  // <-- specifica la tabella
      ],
      group: ['id_giocatore'],
      order: [[db.Sequelize.literal('assist_totali'), 'DESC']],
      include: [{
        model: Giocatore,
        attributes: ['nome', 'cognome'],
        include: [{
          model: Squadra,
          attributes: ['nome']
        }]
      }]
    });

    const classifica = assist.map(a => ({
      id: a.id_giocatore,
      nome: a.Giocatore.nome,
      cognome: a.Giocatore.cognome,
      squadra: a.Giocatore.Squadra?.nome || null,
      assist: parseInt(a.get('assist_totali'), 10)
    }));

    res.json(classifica);
  } catch (error) {
    res.status(500).json({ errore: 'Errore durante il calcolo della classifica assist', dettagli: error.message });
  }
};

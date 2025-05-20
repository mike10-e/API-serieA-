const db = require('../models'); // ✅ Importa i modelli

exports.getPartiteByGiornata = async (req, res) => {
  const giornata = req.params.giornata;

  try {
    const partite = await db.Partita.findAll({
      where: { giornata },
      include: [
        { model: db.Squadra, as: 'squadraCasa', attributes: ['id', 'nome'] },
        { model: db.Squadra, as: 'squadraTrasferta', attributes: ['id', 'nome'] },
      ],
    });

    const partiteRiformattate = partite.map(partita => {
      return {
        id_partita: partita.id,
        squadraCasa: {
          id: partita.squadraCasa.id,
          nome: partita.squadraCasa.nome
        },
        squadraTrasferta: {
          id: partita.squadraTrasferta.id,
          nome: partita.squadraTrasferta.nome
        },
        risultato: {
          golCasa: partita.golCasa,
          golTrasferta: partita.golTrasferta
        }
      };
    });

    res.json({ success: true, data: partiteRiformattate });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero delle partite.',
      error: error.message,
    });
  }
};

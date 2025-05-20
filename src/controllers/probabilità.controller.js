const db = require('../models');
const Partita = db.Partita;
const Squadra = db.Squadra;
const Probabilita = db.Probabilita;
const { Op } = require('sequelize');
const axios = require('axios');

const teamNameMap = {
  'Atalanta BC': 'Atalanta',
  'AS Roma': 'Roma',
  'Inter Milan': 'Inter',
  'AC Milan': 'Milan',
  'Hellas Verona': 'Hellas Verona',
  'Juventus': 'Juventus',
  'Genoa': 'Genoa',
  'Napoli': 'Napoli',
  'Lazio': 'Lazio',
  'Bologna': 'Bologna',
  'Cagliari': 'Cagliari',
  'Como': 'Como',
  'Empoli': 'Empoli',
  'Fiorentina': 'Fiorentina',
  'Lecce': 'Lecce',
  'Monza': 'Monza',
  'Parma': 'Parma',
  'Torino': 'Torino',
  'Udinese': 'Udinese',
  'Venezia': 'Venezia'
};

function normalizeTeamName(apiName) {
  return teamNameMap[apiName] || apiName;
}

async function importProbabilita(req, res) {
  try {
    console.log('Inizio importazione probabilità...');

    const response = await axios.get('https://api.the-odds-api.com/v4/sports/soccer_italy_serie_a/odds', {
      params: {
        apiKey: 'e7d820cdef650d9c7ceb3191eb54a054',
        regions: 'eu',
        markets: 'h2h',
        bookmakers: 'williamhill',
      }
    });

    const oddsData = response.data;

    if (!oddsData || oddsData.length === 0) {
      return res.status(404).json({ message: 'Nessuna probabilità disponibile.' });
    }

    for (const item of oddsData) {
      const homeTeam = normalizeTeamName(item.home_team);
      const awayTeam = normalizeTeamName(item.away_team);

      const homeTeamData = await Squadra.findOne({ where: { nome: homeTeam } });
      const awayTeamData = await Squadra.findOne({ where: { nome: awayTeam } });

      if (!homeTeamData || !awayTeamData) {
        console.log(`Squadre non trovate nel DB: ${homeTeam} vs ${awayTeam}`);
        continue;
      }

      const partita = await Partita.findOne({
        where: {
          id_squadra_casa: homeTeamData.id,
          id_squadra_trasferta: awayTeamData.id,
        }
      });

      if (!partita) {
        console.log(`Partita non trovata nel DB: ${homeTeam} vs ${awayTeam}`);
        continue;
      }

      const outcomes = item.bookmakers?.[0]?.markets?.[0]?.outcomes;

      if (!outcomes || outcomes.length < 3) {
        console.log(`Quote non valide per ${homeTeam} vs ${awayTeam}`);
        continue;
      }

      // Associare le quote per tipo di esito (controllo corretto sul nome)
      let homeWin, draw, awayWin;
      for (const outcome of outcomes) {
        const outcomeName = normalizeTeamName(outcome.name);
        if (outcomeName === homeTeam) {
          homeWin = outcome.price;
        } else if (outcomeName === awayTeam) {
          awayWin = outcome.price;
        } else if (outcomeName.toLowerCase() === 'draw') {
          draw = outcome.price;
        }
      }

      if (!homeWin || !awayWin || !draw) {
        console.log(`Quote mancanti per ${homeTeam} vs ${awayTeam}`);
        continue;
      }

      // Calcolo delle probabilità implicite
      const impHome = 1 / homeWin;
      const impDraw = 1 / draw;
      const impAway = 1 / awayWin;

      const sum = impHome + impDraw + impAway;

      const percentualeVittoria = ((impHome / sum) * 100).toFixed(2);
      const percentualePareggio = ((impDraw / sum) * 100).toFixed(2);
      const percentualeSconfitta = ((impAway / sum) * 100).toFixed(2);

      console.log(`Probabilità ${homeTeam} vs ${awayTeam} => Casa: ${percentualeVittoria}%, X: ${percentualePareggio}%, Trasferta: ${percentualeSconfitta}%`);

      const probabilitaEsistente = await Probabilita.findOne({
        where: { id_partita: partita.id }
      });

      if (probabilitaEsistente) {
        await probabilitaEsistente.update({
          percentualeVittoria,
          percentualeSconfitta,
          percentualePareggio,
        });
      } else {
        await Probabilita.create({
          id_partita: partita.id,
          percentualeVittoria,
          percentualeSconfitta,
          percentualePareggio,
        });
      }
    }

    return res.status(200).json({ message: 'Probabilità importate con successo.' });

  } catch (error) {
    console.error('Errore durante l\'import delle probabilità:', error);
    return res.status(500).json({ message: 'Errore interno.', dettagli: error.message });
  }
}

module.exports = {
  importProbabilita,
};

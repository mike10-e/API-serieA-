const axios = require('axios');
// services/quotesService.js


const getQuotesFromAPI = async () => {
  try {
    const response = await axios.get(
      'https://api.the-odds-api.com/v4/sports/soccer_italy_serie_a/odds',
      {
        params: {
          apiKey: 'e7d820cdef650d9c7ceb3191eb54a054', // imposta come variabile ambiente
          regions: 'eu',
          markets: 'h2h',
          bookmakers: 'williamhill',
        }
      }
    );

    const matches = response.data;

    const parsedQuotes = matches.map((match) => {
      const market = match.bookmakers?.[0]?.markets?.find(m => m.key === 'h2h');

      if (!market) return null;

      const odds = { home: null, draw: null, away: null };

      market.outcomes.forEach(outcome => {
        if (outcome.name === match.home_team) {
          odds.home = outcome.price;
        } else if (outcome.name === match.away_team) {
          odds.away = outcome.price;
        } else if (outcome.name.toLowerCase() === 'draw') {
          odds.draw = outcome.price;
        }
      });

      return {
        homeTeam: match.home_team,
        awayTeam: match.away_team,
        matchDate: match.commence_time,
        odds: odds,
      };
    }).filter(Boolean);

    return parsedQuotes;

  } catch (error) {
    console.error('Errore nella chiamata all\'API delle quote:', error.message);
    return null;
  }
};

module.exports = {
  getQuotesFromAPI,
};

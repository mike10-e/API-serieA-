
const db = require('../models');
const { Partita, Squadra } = db;

async function calcolaClassifica() {
  const partite = await Partita.findAll();

  const classifica = {};

  for (const partita of partite) {
    const { id_squadra_casa, id_squadra_trasferta, golCasa, golTrasferta } = partita;

    // Salta partite non ancora giocate
    if (golCasa === null || golTrasferta === null) continue;

    // Inizializza squadre se non ancora presenti
    for (const id of [id_squadra_casa, id_squadra_trasferta]) {
      if (!classifica[id]) {
        classifica[id] = {
          squadraId: id,
          punti: 0,
          vinte: 0,
          pareggi: 0,
          perse: 0,
          gf: 0,
          gs: 0,
          giocate: 0,
        };
      }
    }

    const casa = classifica[id_squadra_casa];
    const trasferta = classifica[id_squadra_trasferta];

    // Aggiorna statistiche
    casa.gf += golCasa;
    casa.gs += golTrasferta;
    casa.giocate += 1;

    trasferta.gf += golTrasferta;
    trasferta.gs += golCasa;
    trasferta.giocate += 1;

    if (golCasa > golTrasferta) {
      casa.vinte += 1;
      casa.punti += 3;
      trasferta.perse += 1;
    } else if (golCasa < golTrasferta) {
      trasferta.vinte += 1;
      trasferta.punti += 3;
      casa.perse += 1;
    } else {
      casa.pareggi += 1;
      trasferta.pareggi += 1;
      casa.punti += 1;
      trasferta.punti += 1;
    }
  }

  // Recupera i nomi delle squadre
  const squadre = await Squadra.findAll();
  const idToNome = Object.fromEntries(squadre.map(s => [s.id, s.nome]));

  // Converti in array e calcola differenza reti
  const classificaArray = Object.values(classifica).map(s => ({
    nome: idToNome[s.squadraId] || `Squadra ${s.squadraId}`,
    ...s,
    diff: s.gf - s.gs,
  }));

  // Ordina la classifica
  classificaArray.sort((a, b) => {
    if (b.punti !== a.punti) return b.punti - a.punti;
    if (b.diff !== a.diff) return b.diff - a.diff;
    return b.gf - a.gf;
  });

  // Aggiungi posizione
  classificaArray.forEach((squadra, index) => {
    squadra.posizione = index + 1;
  });

  return classificaArray;
}
module.exports = { calcolaClassifica };
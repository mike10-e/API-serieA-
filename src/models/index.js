// index.js
const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool
  }
);

console.log('🔄 Tentativo connessione al DB...');

// Test connessione
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connessione al database riuscita.');
  } catch (error) {
    console.error('❌ Errore nella connessione al database:', error);
  }
}

connectDB();

// IMPORTA I MODELLI
const Giocatore = require('./giocatore.model')(sequelize, DataTypes);
const PartitaModel = require('./giornata.model');
const SquadraModel = require('./squadra.model');
const ProbabilitaModel = require('./probabilità.model');  // Importa il modello Probabilita
const EventoModel = require("./evento.model")

// CREA I MODELLI
const db = {
  Sequelize,
  sequelize,
  Giocatore,
  Probabilita: ProbabilitaModel(sequelize, DataTypes),  // Aggiungi il modello Probabilita
  Partita: PartitaModel(sequelize, DataTypes),
  Squadra: SquadraModel(sequelize, DataTypes),
  Evento: EventoModel(sequelize,DataTypes),
};

// ASSOCIAZIONI
db.Partita.belongsTo(db.Squadra, { foreignKey: 'id_squadra_casa', as: 'squadraCasa' });
db.Partita.belongsTo(db.Squadra, { foreignKey: 'id_squadra_trasferta', as: 'squadraTrasferta' });

db.Partita.hasMany(db.Probabilita, { foreignKey: 'id_partita' });  // Una partita ha molte probabilità
db.Probabilita.belongsTo(db.Partita, { foreignKey: 'id_partita' });  // Ogni probabilità appartiene a una partita

db.Evento.belongsTo(db.Partita,{foreignKey: "id_partita"});
db.Evento.belongsTo(db.Giocatore,{foreignKey: "id_giocatore"} );
db.Partita.hasMany(db.Evento, { foreignKey: 'id_partita'});
db.Giocatore.belongsTo(db.Squadra,{foreignKey: "id_squadra"});
db.Giocatore.hasMany(db.Evento,{foreignKey:"id_giocatore"});




module.exports = db;

const db = require('./models');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotte principali
const giornataRoutes = require('./routes/giornata.routes');
app.use('/api/giornata', giornataRoutes);

const giocatoreRoutes = require('./routes/giocatore.routes');
app.use('/api/giocatore', giocatoreRoutes); 

const probabilitaRoutes = require('./routes/probabilità.routes');
app.use('/api/probabilita', probabilitaRoutes);

const classificaRoutes = require('./routes/classifica.routes');
app.use('/api/classifica', classificaRoutes);

const partitaRoutes = require('./routes/partita.routes');
app.use('/api/partita', partitaRoutes);

const marcatoriRoutes = require('./routes/marcatori.routes');
app.use('/api/statistiche', marcatoriRoutes);

const squadraRoutes = require('./routes/squadra.routes');
app.use('/api/squadra', squadraRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});

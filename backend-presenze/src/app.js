const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const presenzeRouter = require('./routes/presenze');
const utentiRouter = require('./routes/utenti');
const luoghiRouter = require('./routes/luoghi');

const app = express(); // <-- QUESTA RIGA È FONDAMENTALE!
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Log globale per ogni richiesta
app.use((req, res, next) => {
  console.log('Richiesta ricevuta:', req.method, req.url);
  next();
});

// API routes
app.use('/api/presenze', presenzeRouter);
app.use('/api/utenti', utentiRouter);
app.use('/api/luoghi', luoghiRouter);

app.get('/', (req, res) => {
  res.send('Backend Presenze NFC attivo!');
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
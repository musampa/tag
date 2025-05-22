const express = require('express');
const router = express.Router();
const presenzeController = require('../controllers/presenzeController');
const { verifyToken } = require('../utils/auth');

// Per dipendente: registra presenza
router.post('/', verifyToken, presenzeController.registraPresenza);

// Per admin: tabella presenze giornaliera
router.get('/giorno', verifyToken, presenzeController.listaPresenzeGiorno);

// Per admin: esporta CSV
router.get('/csv', verifyToken, presenzeController.presenzeCSV);

// Endpoint per timbratura NFC da mobile
router.post('/timbra', async (req, res) => {
  try {
    const { utente_id, luogo_id, timestamp, lat, lng, tipo_evento } = req.body;
    if (!utente_id || !luogo_id || !timestamp || !lat || !lng || !tipo_evento) {
      return res.status(400).json({ error: 'Dati mancanti' });
    }
    await presenzeController.registraTimbratura({ utente_id, luogo_id, timestamp, lat, lng, tipo_evento }, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno' });
  }
});

module.exports = router;
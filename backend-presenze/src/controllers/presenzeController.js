const pool = require('../db');

// POST /api/presenze
exports.registraPresenza = async (req, res) => {
  try {
    const { tipo_evento, luogo_id } = req.body;
    const utente_id = req.user.id; // preso da JWT

    if (!tipo_evento || !luogo_id) {
      return res.status(400).json({ error: 'Dati mancanti' });
    }

    await pool.query(
      'INSERT INTO presenze (utente_id, luogo_id, tipo_evento, timestamp) VALUES (?, ?, ?, NOW())',
      [utente_id, luogo_id, tipo_evento]
    );
    res.json({ message: 'Presenza registrata!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno' });
  }
};

// GET /api/presenze/giorno?data=YYYY-MM-DD
exports.listaPresenzeGiorno = async (req, res) => {
  try {
    const data = req.query.data;
    if (!data) return res.status(400).json({ error: "Data mancante" });
    const [rows] = await pool.query(
      `SELECT u.nome, p.tipo_evento, p.timestamp, l.nome AS luogo
      FROM presenze p
      JOIN utenti u ON p.utente_id = u.id
      JOIN luoghi l ON p.luogo_id = l.id
      WHERE DATE(p.timestamp) = ?
      ORDER BY u.nome, p.timestamp`,
      [data]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Errore interno" });
  }
};

// GET /api/presenze/csv?data=YYYY-MM-DD
exports.presenzeCSV = async (req, res) => {
  // Implementazione simile, esporta CSV (puoi usare 'json2csv' o simili)
  res.status(501).json({ error: "Non implementato in questa demo" });
};

// Registra timbratura NFC da mobile
exports.registraTimbratura = async (data, res) => {
  try {
    const { utente_id, luogo_id, timestamp, lat, lng, tipo_evento } = data;
    await pool.query(
      'INSERT INTO presenze (utente_id, luogo_id, tipo_evento, timestamp, lat, lng) VALUES (?, ?, ?, ?, ?, ?)',
      [utente_id, luogo_id, tipo_evento, timestamp, lat, lng]
    );
    res.json({ message: 'Timbratura registrata!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno' });
  }
};
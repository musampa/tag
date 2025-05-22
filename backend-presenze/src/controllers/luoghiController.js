const pool = require('../db');

exports.listaLuoghi = async (req, res) => {
  const [rows] = await pool.query('SELECT id, nome FROM luoghi');
  res.json(rows);
};

exports.aggiungiLuogo = async (req, res) => {
  const { nome, id_tag_nfc } = req.body;
  if (!nome || !id_tag_nfc) return res.status(400).json({ error: "Dati mancanti" });
  try {
    await pool.query('INSERT INTO luoghi (nome, id_tag_nfc) VALUES (?, ?)', [nome, id_tag_nfc]);
    res.json({ message: "Luogo aggiunto!" });
  } catch (err) {
    res.status(500).json({ error: "Errore interno" });
  }
};
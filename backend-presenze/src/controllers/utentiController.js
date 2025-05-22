const pool = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.login = async (req, res) => {
  console.log('Login endpoint chiamato', req.body);
  const { email, password } = req.body;

  const [rows] = await pool.query('SELECT * FROM utenti WHERE email = ?', [email]);
  if (!rows.length) {
    console.log('Email non trovata:', email);
    return res.status(401).json({ error: "Credenziali errate" });
  }
  const utente = rows[0];
  const match = await bcrypt.compare(password, utente.password_hash);
  if (!match) {
    console.log('Password errata per:', email);
    return res.status(401).json({ error: "Credenziali errate" });
  }

  // Ruolo: "admin" o "dipendente" o "root"
  const token = jwt.sign({ id: utente.id, nome: utente.nome, ruolo: utente.ruolo }, process.env.JWT_SECRET, { expiresIn: '12h' });
  // Rispondi sempre con id, nome, ruolo
  res.json({ token, utente: { id: utente.id, nome: utente.nome, ruolo: utente.ruolo } });
};

exports.register = async (req, res) => {
  const { nome, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.query('INSERT INTO utenti (nome, email, password_hash, ruolo) VALUES (?, ?, ?, "dipendente")', [nome, email, hash]);
    res.json({ message: "Utente registrato!" });
  } catch (err) {
    res.status(500).json({ error: "Registrazione fallita" });
  }
};
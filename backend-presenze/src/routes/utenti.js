const express = require('express');
const router = express.Router();
const utentiController = require('../controllers/utentiController');

// Usa il controller per il login
router.post('/login', utentiController.login);

// Usa il controller per la registrazione
router.post('/register', utentiController.register);

module.exports = router;
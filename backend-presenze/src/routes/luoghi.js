const express = require('express');
const router = express.Router();
const luoghiController = require('../controllers/luoghiController');
const { verifyToken } = require('../utils/auth');

// Solo admin: gestione luoghi
router.get('/', verifyToken, luoghiController.listaLuoghi);
router.post('/', verifyToken, luoghiController.aggiungiLuogo);

module.exports = router;
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware verifica JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token mancante" });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token non valido" });
    req.user = user;
    next();
  });
}

module.exports = { verifyToken };
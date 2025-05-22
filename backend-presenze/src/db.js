const mysql = require('mysql2/promise'); // usa la versione promise

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'romamerda',
  database: process.env.DB_NAME || 'presenze_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test di connessione
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('Connesso al database MySQL!');
    conn.release();
  } catch (err) {
    console.error('Errore di connessione al database:', err);
  }
})();

module.exports = pool;
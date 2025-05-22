const mysql = require('mysql2/promise');

// Modifica questi parametri secondo la tua configurazione
const dbConfig = {
  host: 'localhost',
  user: 'marcorozzi',
  password: 'romamerda',
  database: 'presenze_db'
};

async function testConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connessione al database riuscita!');
    await connection.end();
  } catch (err) {
    console.error('❌ Errore nella connessione al database:');
    console.error(err.message);
  }
}

testConnection();
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://COCACOLADMIN:JaetwlyFUfMuNkim@cocacolastick.iygril0.mongodb.net/?retryWrites=true&w=majority&appName=COCACOLASTICK'

const client = new MongoClient(uri, {
   serverSelectionTimeoutMS: 5000, 
   serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
});

class DatabaseConfig {
  constructor() {
    this.database = null;
  }

  async collegaAlDB() {
    await client.connect();
    console.log('Apro la connessione')
    try {
      this.database = client.db('COCACOLASTICK');
    } catch (err) {
      console.error('Errore in fase di connessione al db:', err);
    }
  }

  getCollezione(collezioneNome) {
    if (!this.database) {
      throw new Error('La connessione al database non è stata inizializzata.');
    }
    return this.database.collection(collezioneNome);
  }

  async chiudiConnessione() {
    try {
      console.log('chiudo la connessione')
      await client.close();
    } catch (err) {
      console.error('Errore in fase di chiusura della connessione al db:', err);
      throw err;
    }
  }
}

process.on('SIGINT', async () => {
  const db = new DatabaseConfig();
  await db.chiudiConnessione();
  process.exit(0);
});

module.exports = DatabaseConfig;
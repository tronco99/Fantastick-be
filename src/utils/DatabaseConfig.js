const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://COCACOLADMIN:JaetwlyFUfMuNkim@cocacolastick.iygril0.mongodb.net/?retryWrites=true&w=majority&appName=COCACOLASTICK'

const client = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
});

class DatabaseConfig {
  async collegaAlDB() {
      await client.connect();
      console.log('Apro la connessione')
      try {
        const db = client.db('COCACOLASTICK');
        return db
      } catch (err) {
        console.error('Errore in fase di connessione al db:', err);
      }
  }

  async collegaAllaCollezione(NOME_COLLEZIONE) {
    await client.connect();
    console.log('Apro la connessione')
    try {
      const db = client.db('COCACOLASTICK');
      return await db.collection(NOME_COLLEZIONE)
    } catch (err) {
      console.error('Errore in fase di connessione al db:', err);
    }
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

module.exports = DatabaseConfig;
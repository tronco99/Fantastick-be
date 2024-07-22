/*const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://COCACOLADMIN:JaetwlyFUfMuNkim@cocacolastick.iygril0.mongodb.net/?retryWrites=true&w=majority&appName=COCACOLASTICK'

let client;

const connectToMongoDB = async () => {
  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
  });

  client.on('close', async () => {
    console.log('Connessione con MongoDB chiusa, ricollego...');
    await reconnect();
  });

  try {
    await client.connect();
  } catch (err) {
    console.error('Errore in fase di connessione con mongodb:', err);
  }
};

const reconnect = async () => {
  let isConnected = false;
  while (!isConnected) {
    try {
      await client.connect();
      console.log('Riconnesione a MongoDB');
      isConnected = true;
      // Reinitialize your services if necessary
      new BonusService(true);
      new CategorieService(true);
      new GiocatoreService(true);
      new LegaService(true);
      new SquadraService(true);
      new UserService(true);
    } catch (err) {
      console.error('Riconnessione fallita. Riprovo in 5 secondi...', err);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

class DatabaseConfig {
  constructor() {
    this.database = null;
  }
  
  async collegaAlDB() {
    await connectToMongoDB();
    console.log('Apro la connessione');
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
      console.log('Chiudo la connessione');
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

const dbConfig = new DatabaseConfig();
dbConfig.collegaAlDB();

*/
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

client.on('close', async () => {
  console.log('Connection to MongoDB closed, attempting to reconnect...');
  new BonusService(true);
  new CategorieService(true);
  new GiocatoreService(true);
  new LegaService(true);
  new SquadraService(true);
  new UserService(true);
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
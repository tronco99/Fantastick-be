const { MongoClient, ServerApiVersion } = require('mongodb'); // Importa il modulo MongoClient da mongodb

const uri = 'mongodb+srv://COCACOLADMIN:JaetwlyFUfMuNkim@cocacolastick.iygril0.mongodb.net/?retryWrites=true&w=majority&appName=COCACOLASTICK'

const client = new MongoClient(uri, {
    serverApi: {
        version: '1', // Versione della Server API
        strict: true,
        deprecationErrors: true,
    }
});
module.exports = client; // Esporta il client MongoDB per consentire l'uso in altri file del progetto



/*try {
    await dbConfig.connect();
    const db = dbConfig.db('COCACOLASTICK');

    try {
      const result = await db.collection('BONUS').findOne({});
      console.log('Primo documento dalla collezione "BONUS":', result);
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
    console.log("saj")

  } finally {
    await dbConfig.close();
  }*/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Bonus = require('./models/BonusModel'); 

const app = express();
const PORT = process.env.PORT || 80; 
const dbConfig = require('./config/database');
app.use(cors()); 

app.get('/', async (req, res) => {
  const oggettoDato = await recuperaUnDato();
  res.json(oggettoDato);
});

app.use(bodyParser.json());

app.get('/ciao/:nome', async (req, res) => {
  const oggettoDato = await recuperaUnDato();
  res.json(oggettoDato);
});

async function recuperaUnDato() {
  try {
    await dbConfig.connect();
    const db = dbConfig.db('COCACOLASTICK');
    try {

       result = await db.collection('BONUS').findOne({});
      console.log('ricevuta richiesta, ritorno qualcosa');
      console.log(result)
      return result

    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
  } finally {
    await dbConfig.close();
  }
}

async function run() {
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

run().catch(console.dir);

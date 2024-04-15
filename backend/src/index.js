const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Bonus = require('./models/BonusModel'); 

const app = express();
const port = 3000;
const dbConfig = require('./config/database');
app.use(cors()); 

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use(bodyParser.json());

app.get('/ciao/:nome', async (req, res) => {
  const oggettoDato = await recuperaUnDato();
  res.json(oggettoDato);
});

app.get('/', async (req, res) => {
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


run().catch(console.dir);
const express = require('express');
const app = express();
const port = 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://COCACOLADMIN:JaetwlyFUfMuNkim@cocacolastick.iygril0.mongodb.net/?retryWrites=true&w=majority&appName=COCACOLASTICK";

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db('COCACOLASTICK');

    await db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    try {
      const result = await db.collection('BONUS').findOne({});
      console.log('Primo documento dalla collezione "BONUS":', result);
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
    console.log("saj")
  
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
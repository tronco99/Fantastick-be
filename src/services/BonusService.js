const DatabaseConfig = require('../utils/DatabaseConfig');
const { ObjectId } = require('mongodb');
const cron = require('node-cron');

const NOME_COLLEZIONE = 'BONUS'

let databaseConfig;
let collection;

class BonusService {
  constructor(init) {
    console.log('inizializzo bonus')
    if (init) {
      this.databaseConfig = new DatabaseConfig();
      this.init();
    }
  }

  async init() {
    await this.databaseConfig.collegaAlDB();
    collection = this.databaseConfig.getCollezione(NOME_COLLEZIONE);
  }

  async getAll() {
    try {
      console.log('bonus service')
      return await collection.find({}).toArray();
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
  }

  async getById(id) {
    try {
      const objectId = ObjectId.createFromHexString(id);
      return await collection.findOne({ _id: objectId });
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
  }

  async aggiungiBonus(bonus, res) {
    try {
      return await collection.insertMany(bonus);
    } catch (err) {
      res.status(500).send({ message: 'Aggiornamento fallito', error: err.message });
    }
  }

  async getBonusPerLega(id, res) {
    try {
      const objectId = ObjectId.createFromHexString(id);
      return await collection.find({ IDLEGA: objectId }).toArray();
    } catch (err) {
      console.log(err.message)
      res.status(500).send({ message: 'Estrazione fallita', error: err.message });
    }
  }

  async getAllSync() {
    try {
      let res = await collection.find({ NPUNTEGGIO: 33}).toArray();
      console.log(res)
      return res
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
  }
}

cron.schedule('*/0.5 * * * *', async () => {
  const bs = new BonusService(false);
  //todo diminuisci la ricorrenza
  bs.getAllSync();
  bs.getAllSync();
  bs.getAllSync();
});

module.exports = BonusService;
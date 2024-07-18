const DatabaseConfig = require('../utils/DatabaseConfig');
const { ObjectId } = require('mongodb');

const NOME_COLLEZIONE = 'BONUS'

let databaseConfig;
let collection;

class BonusService {
  constructor() {
    this.databaseConfig = new DatabaseConfig();
    this.init();
  }

  async init() {
    await this.databaseConfig.collegaAlDB();
    collection = this.databaseConfig.getCollezione(NOME_COLLEZIONE);
  }

  async getAll() {
    try {
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
      const result = await collection.insertMany(bonus);
      console.log('inseriti i bonus')

   //   res.status(200).send({ message: 'Inserite ' + result.modifiedCount + ' righe', result });
    } catch (err) {
    //  res.status(500).send({ message: 'Aggiornamento fallito', error: err.message });
    }
  }
}

module.exports = BonusService;
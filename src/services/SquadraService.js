const DatabaseConfig = require('../utils/DatabaseConfig');
const { ObjectId } = require('mongodb');

const NOME_COLLEZIONE = 'SQUADRA'

let databaseConfig;
let collection;

class SquadraService {
  constructor(init) {
    this.databaseConfig = new DatabaseConfig();
    if (init)
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
      return await this.collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
  }

  async getSquadrePerLega(id, res) {
    try {
      const objectId = ObjectId.createFromHexString(id);
      return await collection.find({ IDLEGA: objectId }).toArray();
    } catch (err) {
      console.log(err.message)
      res.status(500).send({ message: 'Estrazione fallita', error: err.message });
    }
  }

  async inserisciSquadra(nuovaSquadra, res) {
    try {
      return await collection.insertOne(nuovaSquadra);
    } catch (err) {
      console.log(err)
      res.status(500).send({ message: 'Aggiornamento fallito', error: err.message });
    }
  }
}

module.exports = SquadraService;
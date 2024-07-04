const DatabaseConfig = require('../utils/DatabaseConfig');
const { ObjectId } = require('mongodb');

const NOME_COLLEZIONE = 'SQUADRA'

let databaseConfig;
let collection;

class SquadraService {
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
      const database = await databaseConfig.collegaAlDB()
      const result = await database.collection(NOME_COLLEZIONE).findOne({ _id: new ObjectId(id) });
      return result
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
    finally
    {
      await databaseConfig.chiudiConnessione();
    }
  }
}

module.exports = SquadraService;
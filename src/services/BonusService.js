const Bonus = require('../models/BonusModel');
const DatabaseConfig = require('../config/DatabaseConfig');
const { ObjectId } = require('mongodb');

const NOME_COLLEZIONE = 'BONUS'

const databaseConfig = new DatabaseConfig();

class BonusService {
  async getAll() {
    try {
      const database = await databaseConfig.collegaAlDB()
      const result = await database.collection(NOME_COLLEZIONE).find({}).toArray();
      return result
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
    finally
    {
      await databaseConfig.chiudiConnessione();
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

module.exports = BonusService;
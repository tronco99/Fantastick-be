const DatabaseConfig = require('../config/DatabaseConfig');
const { ObjectId } = require('mongodb');

const NOME_COLLEZIONE = 'LEGA'

const databaseConfig = new DatabaseConfig();

class LegaService {
  async getAll() {
    try {
      const database = await databaseConfig.collegaAllaCollezione(NOME_COLLEZIONE)
      return await database.find({}).toArray();
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
      const database = await databaseConfig.collegaAllaCollezione(NOME_COLLEZIONE)
      return await database.findOne({ _id: id });
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
    finally
    {
      await databaseConfig.chiudiConnessione();
    }
  }

  async getLeghePerUtente(id) {
    try {
      const database = await databaseConfig.collegaAllaCollezione(NOME_COLLEZIONE)
      return await database.find({ LIDUSER: id }).toArray();
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
    finally
    {
      await databaseConfig.chiudiConnessione();
    }
  }
}

module.exports = LegaService;
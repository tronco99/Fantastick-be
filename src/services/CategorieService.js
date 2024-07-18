const DatabaseConfig = require('../utils/DatabaseConfig');
const { ObjectId } = require('mongodb');

const NOME_COLLEZIONE = 'CATEGORIE'

let databaseConfig;
let collection;

class CategorieService {
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

  async aggiungiCategorie(categorie, res) {
    try {
      const result = await collection.insertMany(categorie);
      console.log('inseriti i categorie')

     // res.status(200).send({ message: 'Inserite ' + result.modifiedCount + ' righe', result });
    } catch (err) {
    //  res.status(500).send({ message: 'Aggiornamento fallito', error: err.message });
    }
  }
}

module.exports = CategorieService;
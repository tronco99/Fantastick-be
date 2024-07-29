const DatabaseConfig = require('../utils/DatabaseConfig');
const { ObjectId } = require('mongodb');

const NOME_COLLEZIONE = 'AZIONE'

let databaseConfig;
let collection;

class AzioneService {
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
      const objectId = ObjectId.createFromHexString(id);
      return await collection.findOne({ _id: objectId });
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
  }

  async aggiungiAzioni(azioni, res) {
    try {
      return await collection.insertMany(azioni);
    } catch (err) {
      res.status(500).send({ message: 'Aggiornamento fallito', error: err.message });
    }
  }

  async getAzionePerLega(idLega, res) {
    try {
      const objectId = ObjectId.createFromHexString(idLega);

      const queryPerEstrarreIGiocatori = [
        // Fase 1: Unione con la collezione "squadra"
        {
          $lookup: {
            from: "SQUADRA",
            localField: "IDLEGA",
            foreignField: "IDLEGA",
            as: "squadra_info"
          }
        },
        { $unwind: "$squadra_info" },
        {
          $lookup: {
            from: "GIOCATORE",
            localField: "IDGIOCATORE",
            foreignField: "_id",
            as: "giocatore_info"
          }
        },
        { $unwind: "$giocatore_info" }
      ]
      return await collection.aggregate(queryPerEstrarreIGiocatori).toArray();

      return await collection.find({ IDLEGA: objectId }).toArray();
    } catch (err) {
      console.log(err.message)
      res.status(500).send({ message: 'Estrazione fallita', error: err.message });
    }
  }

}

module.exports = AzioneService;
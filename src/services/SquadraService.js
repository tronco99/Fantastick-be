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

  
  async getClassificaVuotaPerLega(idLega, res) {
    try {
      const objectId = ObjectId.createFromHexString(idLega);

      const queryPerEstrarreIGiocatori =
        [
          {
            $match: { IDLEGA: objectId }
          },
          {
            $lookup: {
              from: "USER",
              localField: "IDUSER",
              foreignField: "_id",
              as: "user_info"
            }
          },
          {
            $project: {
              _id: 0,
              nomeSquadra: "$CNOME",
              nicknameUser: { $arrayElemAt: ["$user_info.CNICKNAME", 0] },
              idUser: { $arrayElemAt: ["$user_info._id", 0] },
              bonusGiocatori: "0",
              giocatori: []
            }
          }
        ]
      let data = await collection.aggregate(queryPerEstrarreIGiocatori).toArray();
      return this.calculateAndSortBonus(data);
    } catch (err) {
      console.log(err.message)
      res.status(500).send({ message: 'Estrazione fallita', error: err.message });
    }
  }

  calculateAndSortBonus(data) {
    return data
      .map(squadra => {
        // Calcola il bonus totale per ogni giocatore
        const giocatori = squadra.giocatori.map(giocatore => {
          const bonusTotaleGiocatore = giocatore.bonus.reduce((sum, bonus) => sum + bonus.bonusGiocatore, 0);
          return {
            ...giocatore,
            bonusTotaleGiocatore
          };
        });

        // Calcola il bonus totale per la squadra
        const bonusGiocatori = giocatori.reduce((acc, giocatore) => acc + giocatore.bonusTotaleGiocatore, 0);

        return {
          ...squadra,
          giocatori,
          bonusGiocatori
        };
      })
      .sort((a, b) => b.bonusGiocatori - a.bonusGiocatori);
  }
}

module.exports = SquadraService;
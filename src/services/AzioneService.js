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
            from: "USER",
            localField: "squadra_info.IDUSER",
            foreignField: "_id",
            as: "user_info"
          }
        },
        { $unwind: "$user_info" },
        {
          $addFields: {
            "squadra_info.LIDGIOCATORIO": {
              $map: {
                input: "$squadra_info.LIDGIOCATORI",
                as: "id",
                in: { $toObjectId: "$$id" }
              }
            }
          }
        },
        {
          $lookup: {
            from: "GIOCATORE",
            localField: "squadra_info.LIDGIOCATORIO",
            foreignField: "_id",
            as: "giocatori_info"
          }
        },
        { $unwind: "$giocatori_info" },
        {
          $lookup: {
            from: "BONUS",
            localField: "LAZIONI.IDBONUS",
            foreignField: "_id",
            as: "bonus_info"
          }
        },
        { $unwind: "$bonus_info" },
        // Aggiungi dettagli del bonus a LAZIONI
        {
          $unwind: "$LAZIONI"
        },
        {
          $lookup: {
            from: "BONUS",
            localField: "LAZIONI.IDBONUS",
            foreignField: "_id",
            as: "bonus_info"
          }
        },
        { $unwind: "$bonus_info" },

        // Aggiungi dettagli del bonus a LAZIONI
        {
          $addFields: {
            "LAZIONI.bonus": {
              bonusId: "$bonus_info._id",
              bonusTitolo: "$bonus_info.CTITOLO",
              bonusDescrizione: "$bonus_info.CDESCRIZIONE",
              bonusPunteggio: "$bonus_info.NPUNTEGGIO",
              bonusQuantita: "$LAZIONI.NQUANTITA",
              giocatoreId: "$IDGIOCATORE"
            }
          }
        },

        // Raggruppamento dei bonus per giocatore
        {
          $group: {
            _id: {
              giocatoreId: "$giocatori_info._id",
              giocatoreNome: "$giocatori_info.CNOME",
              giocatorePrezzo: "$giocatori_info.NPREZZO",
              squadraNome: "$squadra_info.CNOME",
              userNickName: "$user_info.CNICKNAME",
              userId: "$user_info._id"
            },
            bonus: {
              $push: "$LAZIONI.bonus"
            }
          }
        },

        // Filtra i bonus nulli e raggruppa i bonus per giocatore
        {
          $addFields: {
            bonus: {
              $filter: {
                input: "$bonus",
                as: "item",
                cond: { $ne: ["$$item.bonusId", null] }
              }
            }
          }
        },

        // Raggruppamento per squadra e utente per incapsulare i giocatori
        {
          $group: {
            _id: {
              nomeSquadra: "$_id.squadraNome",
              nicknameUser: "$_id.userNickName",
              idUser: "$_id.userId"
            },
            giocatori: {
              $push: {
                _id: "$_id.giocatoreId",
                CNOME: "$_id.giocatoreNome",
                NPREZZO: "$_id.giocatorePrezzo",
                bonus: {
                  $filter: {
                    input: "$bonus",
                    as: "bonus",
                    cond: { $eq: ["$$bonus.giocatoreId", "$_id.giocatoreId"] }
                  }
                }
              }
            }
          }
        },

        // Proiezione finale
        {
          $project: {
            _id: 0,
            nomeSquadra: "$_id.nomeSquadra",
            nicknameUser: "$_id.nicknameUser",
            idUser: "$_id.idUser",
            giocatori: 1
          }
        }
      ]
      return await collection.aggregate(queryPerEstrarreIGiocatori).toArray();
    } catch (err) {
      console.log(err.message)
      res.status(500).send({ message: 'Estrazione fallita', error: err.message });
    }
  }

}

module.exports = AzioneService;
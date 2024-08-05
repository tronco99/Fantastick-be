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

      const queryPerEstrarreIGiocatori =
        [
          {
            $match: { IDLEGA: objectId }
          },
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
          {
            $addFields: {
              "LAZIONI.bonus": {
                bonusId: "$bonus_info._id",
                bonusTitolo: "$bonus_info.CTITOLO",
                bonusDescrizione: "$bonus_info.CDESCRIZIONE",
                bonusPunteggio: "$bonus_info.NPUNTEGGIO",
                bonusQuantita: "$LAZIONI.NQUANTITA",
                bonusGiocatore: { $multiply: ["$bonus_info.NPUNTEGGIO", "$LAZIONI.NQUANTITA"] },
                giocatoreId: "$IDGIOCATORE"
              }
            }
          },
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

  calculateAndSortNome(data) {
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
      .reduce((acc, curr) => {
        return acc.concat(curr.giocatori);
      }, [])
      .sort((a, b) => b.bonusTotaleGiocatore - a.bonusTotaleGiocatore);

    /*return data
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
      .sort((a, b) => b.bonusTotaleGiocatore - a.bonusTotaleGiocatore);*/
  }

  async getAzioniGiocatoriPerLega(idLega, res) {
    try {
      const objectId = ObjectId.createFromHexString(idLega);

      const queryPerEstrarreIGiocatori =
        [
          {
            $match: { IDLEGA: objectId }
          },
          {
            $lookup: {
              from: "CATEGORIE",
              localField: "IDLEGA",
              foreignField: "IDLEGA",
              as: "categorie_info"
            }
          },
          { $unwind: "$categorie_info" },
          {
            $addFields: {
              "categorie_info.LIDGIOCATORIO": {
                $map: {
                  input: "$categorie_info.LIDGIOCATORI",
                  as: "id",
                  in: { $toObjectId: "$$id" }
                }
              }
            }
          },
          {
            $lookup: {
              from: "GIOCATORE",
              localField: "categorie_info.LIDGIOCATORIO",
              foreignField: "_id",
              as: "giocatori_info"
            }
          },
          { $unwind: "$giocatori_info" },
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
          {
            $addFields: {
              "LAZIONI.bonus": {
                bonusId: "$bonus_info._id",
                bonusTitolo: "$bonus_info.CTITOLO",
                bonusDescrizione: "$bonus_info.CDESCRIZIONE",
                bonusPunteggio: "$bonus_info.NPUNTEGGIO",
                bonusQuantita: "$LAZIONI.NQUANTITA",
                bonusGiocatore: { $multiply: ["$bonus_info.NPUNTEGGIO", "$LAZIONI.NQUANTITA"] },
                giocatoreId: "$IDGIOCATORE"
              }
            }
          },
          {
            $group: {
              _id: {
                giocatoreId: "$giocatori_info._id",
                giocatoreNome: "$giocatori_info.CNOME",
                giocatorePrezzo: "$giocatori_info.NPREZZO",
                categoriaNome: "$categorie_info.CDESCRIZIONE",
              },
              bonus: {
                $push: "$LAZIONI.bonus"
              }
            }
          },
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
          {
            $group: {
              _id: {
                categoriaNome: "$_id.categoriaNome",
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
          {
            $project: {
              _id: 0,
              categoriaNome: "$_id.categoriaNome",
              giocatori: 1
            }
          }
        ]
      let data = await collection.aggregate(queryPerEstrarreIGiocatori).toArray();
      return this.calculateAndSortNome(data);
    } catch (err) {
      console.log(err.message)
      res.status(500).send({ message: 'Estrazione fallita', error: err.message });
    }
  }

  async replaceAzione(azione, res) {
    try {
      let azioneObjectId = this.convertToObjectId(azione);

      const result = await collection.updateOne(
        {
          IDLEGA: azioneObjectId.IDLEGA, IDGIOCATORE: azioneObjectId.IDGIOCATORE
        },
        { $set: azioneObjectId },
        { upsert: true } // Aggiunge il documento se non esiste
      );
      res.status(200).send({ status: "success", message: 'Aggiornate ' + result.modifiedCount + ' righe', result });
    } catch (err) {
      console.log(err.message)
      res.status(500).send({ status: "error", message: 'Aggiornamento fallito', error: err.message });
    }


  }

  convertToObjectId(obj) {
    obj.IDLEGA = ObjectId.createFromHexString(obj.IDLEGA);
    obj.IDGIOCATORE = ObjectId.createFromHexString(obj.IDGIOCATORE);
    obj.LAZIONI = obj.LAZIONI.map(action => {
      action.IDBONUS = ObjectId.createFromHexString(action.IDBONUS);
      return action;
    });
    return obj;
  }
}

module.exports = AzioneService;
const DatabaseConfig = require('../utils/DatabaseConfig');
const { ObjectId } = require('mongodb');

const NOME_COLLEZIONE = 'CATEGORIE'

let databaseConfig;
let collection;

class CategorieService {
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

  async aggiungiCategorie(categorie, res) {
    try {
      return await collection.insertMany(categorie);
    } catch (err) {
      res.status(500).send({ message: 'Aggiornamento fallito', error: err.message });
    }
  }

  async getCategoriePerLega(id, res) {
    try {
      const objectId = ObjectId.createFromHexString(id);
      const queryPerEstrarreIGiocatori = [
        {
          $match: { IDLEGA: objectId }
        },
        {
          $addFields: {
            LIDGIOCATORI: {
              $map: {
                input: "$LIDGIOCATORI",
                as: "id",
                in: { $toObjectId: "$$id" }
              }
            }
          }
        },
        {
          $lookup: {
            from: "GIOCATORE",
            localField: "LIDGIOCATORI",
            foreignField: "_id",
            as: "giocatoriDettagli"
          }
        },
        {
          $project: {
            _id: 1,
            CDESCRIZIONE: 1,
            giocatoriCollegati: {
              $map: {
                input: "$giocatoriDettagli",
                as: "giocatore",
                in: {
                  nuovoIdGiocatore: "$$giocatore.giocatoreId",
                  nuovoNomeGiocatore: "$$giocatore.CNOME",
                  nuovoCostoGiocatore: "$$giocatore.NPREZZO"
                }
              }
            }
          }
        }
      ]
      return await collection.aggregate(queryPerEstrarreIGiocatori).toArray();
    } catch (err) {
      console.log(err.message)
      res.status(500).send({ message: 'Estrazione fallita', error: err.message });
    }
  }

  async getCategoriePerLegaConBonus(id, res) {
    try {
      const objectId = ObjectId.createFromHexString(id);
      const queryPerEstrarreIGiocatori = 
      [
        {
          $match: { IDLEGA: objectId }
        },
        {
          $addFields: {
            LIDGIOCATORI: {
              $map: {
                input: "$LIDGIOCATORI",
                as: "id",
                in: { $toObjectId: "$$id" }
              }
            }
          }
        },
        {
          $lookup: {
            from: "GIOCATORE",
            localField: "LIDGIOCATORI",
            foreignField: "_id",
            as: "giocatoriDettagli"
          }
        },
        {
          $lookup: {
            from: "AZIONE",
            localField: "LIDGIOCATORI",
            foreignField: "IDGIOCATORE",
            as: "azioniDettagli"
          }
        },
        {
          $unwind: {
            path: "$azioniDettagli",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "BONUS",
            localField: "azioniDettagli.LAZIONI.IDBONUS",
            foreignField: "_id",
            as: "bonusDettagli"
          }
        },
        {
          $group: {
            _id: "$_id",
            CDESCRIZIONE: { $first: "$CDESCRIZIONE" },
            giocatoriDettagli: { $first: "$giocatoriDettagli" },
            azioniDettagli: { $push: "$azioniDettagli" },
            bonusDettagli: { $push: "$bonusDettagli" }
          }
        },
        {
          $project: {
            _id: 1,
            CDESCRIZIONE: "$CDESCRIZIONE" ,
            giocatoriDettagli:  "$giocatoriDettagli" ,

            CDESCRIZIONE: 1,
            giocatoriCollegati: {
              $map: {
                input: "$giocatoriDettagli",
                as: "giocatore",
                in: {
                  nuovoIdGiocatore: "$$giocatore._id",
                  nuovoNomeGiocatore: "$$giocatore.CNOME",
                  nuovoCostoGiocatore: "$$giocatore.NPREZZO",
                  bonus: {
                    $filter: {
                      input: "$bonusDettagli",
                      as: "bonus",
                      cond: {
                        $in: ["$$giocatore._id", "$$bonus.IDGIOCATORE"]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      ]


      /*[
        {
          $match: { IDLEGA: objectId }
        },
        {
          $addFields: {
            LIDGIOCATORI: {
              $map: {
                input: "$LIDGIOCATORI",
                as: "id",
                in: { $toObjectId: "$$id" }
              }
            }
          }
        },
        {
          $lookup: {
            from: "GIOCATORE",
            localField: "LIDGIOCATORI",
            foreignField: "_id",
            as: "giocatoriDettagli"
          }
        },
        {
          $lookup: {
            from: "AZIONE",
            localField: "LIDGIOCATORI",
            foreignField: "IDGIOCATORE",
            as: "azioniDettagli"
          }
        },
        {
          $project: {
            _id: 1,
            CDESCRIZIONE: 1,
            giocatoriCollegati: {
              $map: {
                input: "$giocatoriDettagli",
                as: "giocatore",
                in: {
                  nuovoIdGiocatore: "$$giocatore.giocatoreId",
                  nuovoNomeGiocatore: "$$giocatore.CNOME",
                  nuovoCostoGiocatore: "$$giocatore.NPREZZO",
                }
              }
            }
          }
        }
      ]



      /*
      [
        {
          $match: { IDLEGA: objectId }
        },
        {
          $addFields: {
            LIDGIOCATORI: {
              $map: {
                input: "$LIDGIOCATORI",
                as: "id",
                in: { $toObjectId: "$$id" }
              }
            }
          }
        },
        {
          $lookup: {
            from: "GIOCATORE",
            localField: "LIDGIOCATORI",
            foreignField: "_id",
            as: "giocatoriDettagli"
          }
        },
        {
          $lookup: {
            from: "AZIONE",
            localField: "LIDGIOCATORI",
            foreignField: "IDGIOCATORE",
            as: "azioniDettagli"
          }
        },
        {
          $addFields: {
            LBONUS: {
              $map: {
                input: "$azioniDettagli.LAZIONI",
                as: "id",
                in: "$azioniDettagli.LAZIONI"
              }
            }
          }
        },
        {
          $lookup: {
            from: "BONUS",
            localField: "LBONUS._id.IDBONUS",
            foreignField: "_id",
            as: "bonusDettagli"
          }
        },
        {
          $project: {
            _id: 1,
            CDESCRIZIONE: 1,
            bonusDettagli: "$bonusDettagli",

            giocatoriCollegati: {
              $map: {
                input: "$giocatoriDettagli",
                as: "giocatore",
                in: {
                  nuovoIdGiocatore: "$$giocatore.giocatoreId",
                  nuovoNomeGiocatore: "$$giocatore.CNOME",
                  nuovoCostoGiocatore: "$$giocatore.NPREZZO",
                  azioniDettagli: "$azioniDettagli",
                  bonusDettagli: "$bonusDettagli",
      
               //   azioniDettagli: "$azioniDettagli.LAZIONI",
                 // azioniPunti: "$azioniDettagli.LAZIONI"
                }
              }
            }
          }
        }
      ]*/
      return await collection.aggregate(queryPerEstrarreIGiocatori).toArray();
    } catch (err) {
      console.log(err.message)
      res.status(500).send({ message: 'Estrazione fallita', error: err.message });
    }
  }
}
module.exports = CategorieService;
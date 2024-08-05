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
              CDESCRIZIONE: "$CDESCRIZIONE",
              giocatoriDettagli: "$giocatoriDettagli",

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
      return await collection.aggregate(queryPerEstrarreIGiocatori).toArray();
    } catch (err) {
      console.log(err.message)
      res.status(500).send({ message: 'Estrazione fallita', error: err.message });
    }
  }

  async getCategoriePerLegaSenzaBonus(id, res) {
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
      let data = await collection.aggregate(queryPerEstrarreIGiocatori).toArray();
      let datoCorretto = this.calculateSortAndAccNome(data);
      return datoCorretto
    } catch (err) {
      console.log(err.message)
      res.status(500).send({ message: 'Estrazione fallita', error: err.message });
    }
  }

  calculateSortAndAccNome(data) {
    return {
      status: 'success', // Usa il valore desiderato o quello dell'input
      message: 'Estrazione compleatata', // Usa il valore desiderato o quello dell'input
      azione: data.reduce((acc, categoria) => {
        // Assicurati che `giocatoriCollegati` sia un array
        const giocatori = (categoria.giocatoriCollegati || []).map(giocatore => ({
          _id: giocatore.nuovoIdGiocatore,
          CNOME: giocatore.nuovoNomeGiocatore,
          NPREZZO: giocatore.nuovoCostoGiocatore,
          bonus: [],
          bonusTotaleGiocatore: 0
        }));
        return acc.concat(giocatori);
      }, [])
    };
  }
}
module.exports = CategorieService;
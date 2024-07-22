const DatabaseConfig = require('../utils/DatabaseConfig');
const { ObjectId } = require('mongodb');

const NOME_COLLEZIONE = 'LEGA'

let databaseConfig;
let collection;

class LegaService {

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
//      let result = await collection.find({}).toArray()
let doc = await collection.findOne();
if (doc) {
  return doc;
} else {
  return {'Collezione esiste': 'ma è vuota.'};
}

    } catch (err) {
      return err;
    }
  }

  async getById(id) {
    try {
      const objectId = ObjectId.createFromHexString(id);
      return await collection.find({ _id: objectId }).toArray();
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
  }

  async getByCnome(nome) {
    try {
      return await collection.find({ CNOME: nome }).toArray();
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
  }

  async getLeghePerUtente(id) {
    try {
      return await collection.find({ LIDUSER: id }).toArray();
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
  }

  async getLegheNonRegistratoVisib(id, visibilita) {
    try {
      const queryGetLegheNonRegistratoVisib = {
        CVISIBILITA: {
          $in: visibilita
        },
        LIDUSER: {
          $ne: id
        },
        $expr: {
          $lt: [
            {
              $size: "$LIDUSER"
            },
            "$NMAXUSER"
          ]
        }
      };
      return await collection.find(queryGetLegheNonRegistratoVisib).toArray();
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
  }

  async getByIdPartecipantiNickname(idLega) {
    try {
      const objectId = ObjectId.createFromHexString(idLega);
      const queryGetByIdPartecipantiNickname =
        [
          {
            "$match": {
              "_id": objectId
            }
          },
          {
            "$addFields": {
              "LIDUSER_ObjectId": {
                "$cond": {
                  "if": { "$isArray": "$LIDUSER" },
                  "then": {
                    "$map": {
                      "input": "$LIDUSER",
                      "as": "userId",
                      "in": { "$toObjectId": "$$userId" }
                    }
                  },
                  "else": []
                }
              },
              "LIDUSERINATTESA_ObjectId": {
                "$cond": {
                  "if": { "$isArray": "$LIDUSERINATTESA" },
                  "then": {
                    "$map": {
                      "input": "$LIDUSERINATTESA",
                      "as": "userId",
                      "in": { "$toObjectId": "$$userId" }
                    }
                  },
                  "else": []
                }
              },
              "LIDUSERADMIN_ObjectId": {
                "$cond": {
                  "if": { "$isArray": "$LIDUSERADMIN" },
                  "then": {
                    "$map": {
                      "input": "$LIDUSERADMIN",
                      "as": "userId",
                      "in": { "$toObjectId": "$$userId" }
                    }
                  },
                  "else": []
                }
              }
            }
          },
          {
            "$lookup": {
              "from": "USER",
              "localField": "LIDUSER_ObjectId",
              "foreignField": "_id",
              "as": "userDetails"
            }
          },
          {
            "$lookup": {
              "from": "USER",
              "localField": "LIDUSERINATTESA_ObjectId",
              "foreignField": "_id",
              "as": "userInAttesaDetails"
            }
          },
          {
            "$lookup": {
              "from": "USER",
              "localField": "LIDUSERADMIN_ObjectId",
              "foreignField": "_id",
              "as": "userAdminDetails"
            }
          },
          {
            "$project": {
              "CNOME": 1,
              "CTIPO": 1,
              "CCATEGORIA": 1,
              "CVISIBILITA": 1,
              "CNOMEVALUTA": 1,
              "NBUDGET": 1,
              "CLOGO": 1,
              "DDATAINIZIO": 1,
              "DDATAFINE": 1,
              "LIDUSER": 1,
              "LIDUSERADMIN": 1,
              "NMAXUSER": 1,
              "userIscritti_CNICKNAME": {
                "$map": {
                  "input": { "$ifNull": ["$userDetails", []] },
                  "as": "user",
                  "in": {
                    "id": { "$toString": "$$user._id" },
                    "nickname": "$$user.CNICKNAME"
                  }
                }
              },
              "userInAttesa_CNICKNAME": {
                "$map": {
                  "input": { "$ifNull": ["$userInAttesaDetails", []] },
                  "as": "user",
                  "in": {
                    "id": { "$toString": "$$user._id" },
                    "nickname": "$$user.CNICKNAME"
                  }
                }
              },
              "userAdmin_CNICKNAME": {
                "$map": {
                  "input": { "$ifNull": ["$userAdminDetails", []] },
                  "as": "user",
                  "in": {
                    "id": { "$toString": "$$user._id" },
                    "nickname": "$$user.CNICKNAME"
                  }
                }
              }
            }
          }
        ];
      return await collection.aggregate(queryGetByIdPartecipantiNickname).toArray();
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
  }

  async aggiungiUtenteALega(idLega, idUtente, res) {
    try {
      const objectId = ObjectId.createFromHexString(idLega);
      const result = await collection.findOneAndUpdate(
        {
          _id: objectId,
          $expr: {
            $lt: [
              { $size: "$LIDUSER" },
              "$NMAXUSER"
            ]
          }
        },
        {
          $addToSet: { LIDUSER: idUtente },
          $pull: { LIDUSERINATTESA: idUtente }
        },
        { returnDocument: 'after' }
      );

      res.status(200).send({ message: 'Aggionato', result });
    } catch (err) {
      res.status(500).send({ message: 'Aggiornamento fallito', error: err.message });
    }
  }

  async aggiungiUtenteInAttesaLega(idLega, idUtente, res) {
    try {
      const objectId = ObjectId.createFromHexString(idLega);
      const result = await collection.updateOne(
        {
          _id: objectId,
          $expr: {
            $lt: [
              {
                $size: "$LIDUSER"
              },
              "$NMAXUSER"
            ]
          }
        },
        {
          $addToSet: {
            LIDUSERINATTESA: idUtente
          }
        }
      );
      res.status(200).send({ message: 'Aggiornate ' + result.modifiedCount + ' righe', result });
    } catch (err) {
      res.status(500).send({ message: 'Aggiornamento fallito', error: err.message });
    }
  }

  async rimuoviUtenteInAttesaLega(idLega, idUtente, res) {
    try {
      const objectId = ObjectId.createFromHexString(idLega);
      const result = await collection.updateOne(
        {
          _id: objectId
        },
        {
          $pull: { LIDUSERINATTESA: idUtente },
          $push: { LIDUSERRIMOSSI: idUtente }
        }
      );
      res.status(200).send({ message: 'Aggiornate ' + result.modifiedCount + ' righe', result });
    } catch (err) {
      res.status(500).send({ message: 'Aggiornamento fallito', error: err.message });
    }
  }

  async rendiAmdinUtente(idLega, idUtente, res) {
    try {
      const objectId = ObjectId.createFromHexString(idLega);
      const result = await collection.updateOne(
        {
          _id: objectId
        },
        {
          $addToSet: { LIDUSERADMIN: idUtente }
        }
      );
      res.status(200).send({ message: 'Aggiornate ' + result.modifiedCount + ' righe', result });
    } catch (err) {
      res.status(500).send({ message: 'Aggiornamento fallito', error: err.message });
    }
  }

  async rimuoviUtenteALega(idLega, idUtente, res) {
    try {
      const objectId = ObjectId.createFromHexString(idLega);
      const result = await collection.updateOne(
        {
          _id: objectId
        },
        {
          $pull: { LIDUSER: idUtente },
          $push: { LIDUSERRIMOSSI: idUtente }
        }
      );
      res.status(200).send({ message: 'Aggiornate ' + result.modifiedCount + ' righe', result });
    } catch (err) {
      res.status(500).send({ message: 'Aggiornamento fallito', error: err.message });
    }
  }

  async aggiungiLega(lega, res) {
    try {
      return await collection.insertOne(lega);
    } catch (err) {
      res.status(500).send({ message: 'Aggiornamento fallito', error: err.message });
    }
  }
}

module.exports = LegaService;

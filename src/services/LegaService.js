const DatabaseConfig = require('../utils/DatabaseConfig');
const MongoQueries = require('../utils/MongoQueries');
const { ObjectId } = require('mongodb');

const COLLEZIONE_LEGA = 'LEGA'

const databaseConfig = new DatabaseConfig();
const mongoQueries = new MongoQueries();

class LegaService {
  async getAll() {
    try {
      const database = await databaseConfig.collegaAllaCollezione(COLLEZIONE_LEGA)
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
      const database = await databaseConfig.collegaAllaCollezione(COLLEZIONE_LEGA)
      const objectId = ObjectId.createFromHexString(id);
      return await database.find({ _id: objectId }).toArray();
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
      const database = await databaseConfig.collegaAllaCollezione(COLLEZIONE_LEGA)
      return await database.find({ LIDUSER: id }).toArray();
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
    finally
    {
      await databaseConfig.chiudiConnessione();
    }
  }

  async getLegheNonRegistratoVisib(id, visibilita) {
    try {
      const database = await databaseConfig.collegaAllaCollezione(COLLEZIONE_LEGA)
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
      return await database.find(queryGetLegheNonRegistratoVisib).toArray();
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
    finally
    {
      await databaseConfig.chiudiConnessione();
    }
  }

  async getByIdPartecipantiNickname(idLega) {
    try {
      const database = await databaseConfig.collegaAllaCollezione(COLLEZIONE_LEGA)
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
            "userIscritti": {
              "$map": {
                "input": { "$ifNull": ["$userDetails", []] },
                "as": "user",
                "in": {
                  "id": { "$toString": "$$user._id" },
                  "nickname": "$$user.CNICKNAME"
                }
              }
            },
            "userInAttesa": {
              "$map": {
                "input": { "$ifNull": ["$userInAttesaDetails", []] },
                "as": "user",
                "in": {
                  "id": { "$toString": "$$user._id" },
                  "nickname": "$$user.CNICKNAME"
                }
              }
            },
            "userAdmin": {
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
      return await database.aggregate(queryGetByIdPartecipantiNickname).toArray();
    } catch (err) {
      console.error('Errore nel recupero del documento:', err);
    }
    finally
    {
      await databaseConfig.chiudiConnessione();
    }
  }
  
  async aggiungiUtenteALega(idLega, idUtente, res) {
    const database = await databaseConfig.collegaAllaCollezione(COLLEZIONE_LEGA)
    try {
      const objectId = ObjectId.createFromHexString(idLega);
    
      const result = await database.findOneAndUpdate(
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
    finally
    {
      await databaseConfig.chiudiConnessione();
    }
  }

  async aggiungiUtenteInAttesaLega(idLega, idUtente, res) {
    const database = await databaseConfig.collegaAllaCollezione(COLLEZIONE_LEGA)
    try {
      const objectId = ObjectId.createFromHexString(idLega);
      const result = await database.updateOne(
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
          $push: {
            LIDUSERINATTESA: idUtente
          }
        }
      );
      res.status(200).send({ message: 'Aggiornate ' + result.modifiedCount + ' righe', result });
    } catch (err) {
      res.status(500).send({ message: 'Aggiornamento fallito', error: err.message });
    }
    finally
    {
      await databaseConfig.chiudiConnessione();
    }
  }
}
module.exports = LegaService;

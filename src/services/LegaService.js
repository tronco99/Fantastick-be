const DatabaseConfig = require('../utils/DatabaseConfig');
const { ObjectId } = require('mongodb');

const COLLEZIONE_LEGA = 'LEGA'

const databaseConfig = new DatabaseConfig();

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
      const query = {
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
      return await database.find(query).toArray();
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
            LIDUSER: idUtente
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

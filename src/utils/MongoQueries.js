class MongoQueries {
  async ciaociaociao(objectId) {
    const pipeline = [
      {
        "$match": {
          "_id": objectId,
          "LIDUSER": { "$exists": true, "$ne": [] },
          "LIDUSERINATTESA": { "$exists": true, "$ne": [] }
        }
      },
      {
        "$addFields": {
          "LIDUSER_ObjectId": {
            "$map": {
              "input": "$LIDUSER",
              "as": "userId",
              "in": { "$toObjectId": "$$userId" }
            }
          },
          "LIDUSERINATTESA_ObjectId": {
            "$map": {
              "input": "$LIDUSERINATTESA",
              "as": "userId",
              "in": { "$toObjectId": "$$userId" }
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
          "NMAXUSER": 1, "userDetailsCNICKNAME": {
            "$map": {
              "input": "$userDetails",
              "as": "user",
              "in": "$$user.CNICKNAME"
            }
          },
          "userInAttesaDetailsCNICKNAME": {
            "$map": {
              "input": "$userInAttesaDetails",
              "as": "user",
              "in": "$$user.CNICKNAME"
            }
          }
        }
      }
    ];   
    return pipeline
  }
}

module.exports = MongoQueries;
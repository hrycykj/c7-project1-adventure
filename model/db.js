const MongoClient = require('mongodb').MongoClient
const dbUrl = "mongodb://localhost:27017/"

let connectMongoClient = MongoClient.connect(dbUrl)

let getDb = connectMongoClient.then((client) => {
    return client.db("C7-project1-Adventure")
})

function getCollection(name) {
    return getDb.then((db) => db.collection(name))
}

module.exports = {
    getCollection,
}
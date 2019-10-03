const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'; 
const dbName = 'employee_service';
let dataStorage
let dataMap

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true},(err, client) => {
    console.log('Successfully connected to MongoDB')

    const db = client.db(dbName)

    dataStorage = db.collection('dataStorage')
    dataMap = db.collection('dataMap')

    // client.close()
})

exports.insertOne = (data, collection) => {
    return eval(collection).insertOne(data)
        .then(res => {
            return res.result
        })
}
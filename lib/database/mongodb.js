const MongoClient = require('mongodb').MongoClient
const Q = require('q')

const url = 'mongodb://localhost:27017'; 
const dbName = 'employee_service';
let dataStorage
let dataMap

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true},(err, client) => {
    console.log('Successfully connected to MongoDB')

    const db = client.db(dbName)

    dataStorage = db.collection('dataStorage')
    dataMap = db.collection('dataMap')

    // dataStorage.fin(data, {projection: {_id: 0}})
    // .then(res => {
    //     return res
    // })
    // .catch(err => {
    //     throw err
    // })

    // dataMap.deleteMany()
    // dataStorage.deleteMany()
    // client.close()
})

exports.insertOneToCollection = (data, collection) => {
    return eval(collection).insertOne(data)
        .then(res => {
            return res.result
        }).catch(err => {
            throw err
        })
}

exports.findInCollection = (data, collection) => {
    let deferred = Q.defer()
    eval(collection).find(data).toArray((err, res) => {
        if (err) {
            deferred.reject(new Error(err))
        } else {
            deferred.resolve(res)
        }
    })
    return deferred.promise
}

exports.findOneInCollection = (data, collection) => {
    return eval(collection).findOne(data, {projection: {_id: 0}})
    .then(res => {
        return res
    })
    .catch(err => {
        throw err
    })
}

exports.updateOneInCollection = (query, data, collection) => {
    return eval(collection).updateOne(query, { $set: data })
    .then(res => {
        return res
    })
    .catch(err => {
        throw err
    })
}
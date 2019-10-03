const db = require('../database/mongodb')
const rawBody = require('raw-body')
const respond = require('../util/response')

exports.insertOneDataMap = (request, response) => {
    rawBody(request)
        .then(buffer => {
            const body = JSON.parse(buffer.toString())

            db.insertOne(body, 'dataMap')
                .then(res => {
                    console.log(res)
                    let responseBody
                    if (res.ok) {
                        responseBody = {
                            status: 'Ok',
                            message: 'Record added',
                          }
                        respond.ok(response, responseBody)
                    } else {
                        responseBody = {
                            status: 'Error',
                            message: 'Internal error occured',
                          }
                        respond.errorServerInternal(response, responseBody)
                    }
                })
        })
}

exports.insertOneDataStorage = (request, response) => {
    rawBody(request)
        .then(buffer => {
            const body = JSON.parse(buffer.toString())

            db.insertOne({body, org: request.headers.org}, 'dataStorage')
                .then(res => {
                    console.log(res)
                    let responseBody
                    if (res.ok) {
                        responseBody = {
                            status: 'Ok',
                            message: 'Record added',
                          }
                        respond.ok(response, responseBody)
                    } else {
                        responseBody = {
                            status: 'Error',
                            message: 'Internal error occured',
                          }
                        respond.errorServerInternal(response, responseBody)
                    }
                })
        })
}
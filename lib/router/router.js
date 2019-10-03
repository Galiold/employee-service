const respond = require('../util/response')
const controller = require('../controller/controller')

const router = require('find-my-way')({
    defaultRoute: (request, response) => {
        const responseBody = {
            status: 'Not Found',
            message: 'Page not found'
        }
        respond.errorNotFound(response, responseBody)
    }
})

router.put('/api/insertdatamap', controller.insertOneDataMap)

router.put('/api/insertdatastorage', controller.insertOneDataStorage)

exports.router = router
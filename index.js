const server = require('./lib/server/server')
const router = require('./lib/router/router')
const requestHandlers = require('./lib/controller/requestHandlers')

const handler = {}
handler['PUT /dataService'] = requestHandlers.storeData
handler['GET /dataService'] = requestHandlers.findData
handler['POST /dataService'] = requestHandlers.updateData

server.start(router.route, handler)
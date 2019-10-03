const http = require('http')
const server = http.createServer()
const router = require('../router/router').router
const PORT = 81

server.on('request', (req, res) => {
    router.lookup(req, res)
}).listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})
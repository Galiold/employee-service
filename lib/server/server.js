/* eslint-disable node/no-deprecated-api */
const http = require('http')
const url = require('url')
const PORT = 81

exports.start = (route, handler) => {
  function onRequest (request, response) {
    const pathName = url.parse(request.url).pathname
    console.log(`Request for ${request.method} ${pathName} received.`)

    route(handler, pathName, request, response)
  }

  http.createServer(onRequest).listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
  })
}

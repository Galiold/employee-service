const respond = require('../util/response')
const requestHandlers = require('../controller/requestHandlers')

exports.route = (handler, pathName, request, response) => {
    console.log(`Routing ${request.method} ${pathName}...`);

    if (typeof handler[`${request.method} ${pathName}`] === 'function') {
        handler[`${request.method} ${pathName}`](request, response)
    } else {
        const responseBody = {
            status: 'Not Found',
            message: 'درخواست نامعتبر نیست'
        }
        respond.errorNotFound(response, responseBody)
    }
}
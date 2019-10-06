const rawBody = require('raw-body')
const Q = require('q')
const AJV = require('ajv')

const db = require('../database/mongodb')
const respond = require('../util/response')
const schemas = require('../schema/schema')

const ajv = new AJV({
  allErrors: true
})

exports.storeData = (request, response) => {
  rawBody(request)
    .then(buffer => {
      const body = JSON.parse(buffer.toString())
      const valid = ajv.validate(schemas.insertSchema, { ...body, ...{ org: request.headers.org } })
      const validationError = ajv.errors
      let responseBody

      if (valid) {
        Q.allSettled([
          db.insertOneToCollection({ id: body.id, data: body.data, org: request.headers.org }, 'dataStorage'),
          db.insertOneToCollection({ id: body.id, parent: body.parent }, 'dataMap')
        ])
          .then(results => {
            const rejections = results.filter(res => res.state === 'rejected')

            if (rejections.length === 0) {
              responseBody = {
                status: 'Ok',
                message: 'داده‌ها ذخیره شد'
              }
              respond.ok(response, responseBody)
            } else if (rejections.length === results.length) {
              let duplicateFound
              rejections.forEach(rejection => {
                if (rejection.reason.code === 11000) {
                  duplicateFound = true
                  responseBody = {
                    status: 'Error',
                    message: 'شناسه‌ی داده‌ها تکراری است'
                  }
                  respond.errorBadRequest(response, responseBody)
                }
              })
              if (!duplicateFound) {
                responseBody = {
                  status: 'Error',
                  message: 'خطای پایگاه داده'
                }
                respond.errorServerInternal(response, responseBody)
              }
            } else {
              Q.all([
                db.deleteOneFromCollection({ id: body.id }, 'dataStorage'),
                db.deleteOneFromCollection({ id: body.id }, 'dataMap')
              ])
                .then(res => {
                  // console.log(res)
                  let duplicateFound = false
                  rejections.forEach(rejection => {
                    if (rejection.reason.code === 11000) {
                      duplicateFound = true
                      responseBody = {
                        status: 'Error',
                        message: 'شناسه‌ی داده‌ها تکراری است، تغییرات لفو شد'
                      }
                      respond.errorBadRequest(response, responseBody)
                    }
                  })
                  if (!duplicateFound) {
                    responseBody = {
                      status: 'Error',
                      message: 'خطای پایگاه داده، تغییرات لفو شد'
                    }
                    respond.errorServerInternal(response, responseBody)
                  }
                })
                .fail(err => {
                  console.log(err)
                  rejections.forEach(rejection => {
                    if (rejection.reason.code === 11000) {
                      responseBody = {
                        status: 'Error',
                        message: 'شناسه‌ی داده‌ها تکراری است، خطای پایگاه داده'
                      }
                      respond.errorBadRequest(response, responseBody)
                    }
                  })
                  responseBody = {
                    status: 'Error',
                    message: 'خطای پایگاه'
                  }
                  respond.errorServerInternal(response, responseBody)
                })
            }
          })
      } else {
        responseBody = {
          status: 'Error',
          message: 'داده‌ی ارسالی معتبر نیست',
          result: validationError
        }
        respond.errorBadRequest(response, responseBody)
      }
    })
}

exports.findData = (request, response) => {
  rawBody(request)
    .then(buffer => {
      const body = JSON.parse(buffer.toString())
      const valid = ajv.validate(schemas.findSchema, { ...body, ...{ org: request.headers.org } })
      const validationError = ajv.errors
      let responseBody

      if (valid) {
        db.findOneInCollection({ id: body.id, org: request.headers.org }, 'dataStorage')
          .then(res => {
            if (res) {
              responseBody = {
                status: 'Ok',
                message: 'داده یافت شد',
                result: res
              }
              respond.ok(response, responseBody)
            } else {
              responseBody = {
                status: 'Error',
                message: 'شناسه پیدا نشد'
              }
              respond.errorNotFound(response, responseBody)
            }
          })
          .catch(err => {
            console.log(err)
            responseBody = {
              status: 'Error',
              message: 'خطای پایگاه داده'
            }
            respond.errorServerInternal(response, responseBody)
          })
      } else {
        responseBody = {
          status: 'Error',
          message: 'داده‌ی ارسالی معتبر نیست',
          result: validationError
        }
        respond.errorBadRequest(response, responseBody)
      }
    })
}

exports.updateData = (request, response) => {
  rawBody(request)
    .then(buffer => {
      const body = JSON.parse(buffer.toString())
      const valid = ajv.validate(schemas.updateSchema, { ...body, ...{ org: request.headers.org } })
      const validationError = ajv.errors
      let responseBody

      if (valid) {
        Q.allSettled([
          db.updateOneInCollection({ id: body.id }, { data: body.data, org: request.headers.org }, 'dataStorage'),
          db.updateOneInCollection({ id: body.id }, { parent: body.parent }, 'dataMap')
        ])
          .then(results => {
            const rejections = results.filter(res => res.state === 'rejected')
            if (rejections.length === 0) {
              results.forEach(res => {
                if (res.value.matchedCount === 0) {
                  responseBody = {
                    status: 'Not Found',
                    message: 'شناسه پیدا نشد'
                  }
                  respond.errorNotFound(response, responseBody)
                }
              })
              responseBody = {
                status: 'Ok',
                message: 'داده‌ها به‌روزرسانی شد'
              }
              respond.ok(response, responseBody)
            } else {
              responseBody = {
                status: 'Error',
                message: 'خطای پایگاه داده'
              }
              respond.errorServerInternal(response, responseBody)
            }
          })
      } else {
        responseBody = {
          status: 'Error',
          message: 'داده‌ی ارسالی معتبر نیست',
          result: validationError
        }
        respond.errorBadRequest(response, responseBody)
      }
    })
}

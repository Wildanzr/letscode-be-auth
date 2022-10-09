class Response {
  constructor () {
    this.success = this.success.bind(this)
    this.fail = this.fail.bind(this)
    this.error = this.error.bind(this)
  }

  success (statusCode, message, data) {
    if (data) {
      return {
        status: statusCode,
        message,
        data
      }
    } else {
      return {
        status: statusCode,
        message
      }
    }
  }

  fail (statusCode, message) {
    return {
      status: statusCode,
      message
    }
  }

  error (res, error) {
    const { statusCode, message } = error
    const msg = message.replace(/['"]+/g, '')

    return res.status(statusCode).json(this.fail(statusCode, msg))
  }
}

module.exports = Response

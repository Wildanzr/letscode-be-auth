const ClientError = require('../errors/clientError')
const {
  registerSchema,
  loginSchema
} = require('./schema')

class Validator {
  constructor () {
    this.validateRegister = this.validateRegister.bind(this)
    this.validateLogin = this.validateLogin.bind(this)
  }

  validateRegister (payload) {
    const { error } = registerSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateLogin (payload) {
    const { error } = loginSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }
}

module.exports = Validator

const { registerSchema } = require('./schema')

class Validator {
  constructor () {
    this.validateRegister = this.validateRegister.bind(this)
  }

  validateRegister (payload) {
    const { error } = registerSchema.validate(payload)
    if (error) throw new Error(error.message)
  }
}

module.exports = Validator

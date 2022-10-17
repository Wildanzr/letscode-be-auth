const { ClientError } = require('../errors')
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyAccountSchema,
  checkTokenSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema
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

  validateForgotPassword (payload) {
    const { error } = forgotPasswordSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateVerifyAccount (payload) {
    const { error } = verifyAccountSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateCheckToken (payload) {
    const { error } = checkTokenSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateResetPassword (payload) {
    const { error } = resetPasswordSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateChangePassword (payload) {
    const { error } = changePasswordSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateUpdateProfile (payload) {
    const { error } = updateProfileSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }
}

module.exports = {
  Validator
}

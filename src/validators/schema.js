const Joi = require('joi')

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  confirmPassword: Joi.ref('password'),
  fullName: Joi.string().min(3).max(100).required(),
  gender: Joi.boolean().required(),
  dateOfBirth: Joi.date().required(),
  role: Joi.number().required().valid(0, 1)
})

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(8).max(30).required(),
  remember: Joi.boolean().truthy('true', 'yes', 1, '1').falsy('false', 'no', 0, '0').required()
})

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
})

const verifyAccountSchema = Joi.object({
  token: Joi.string().required()
})

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyAccountSchema
}

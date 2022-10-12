const Joi = require('joi')

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  confirmPassword: Joi.ref('password'),
  fullName: Joi.string().min(3).max(100).required(),
  gender: Joi.boolean().required(),
  dateOfBirth: Joi.date().required()
})

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(8).max(30).required()
})

module.exports = {
  registerSchema,
  loginSchema
}

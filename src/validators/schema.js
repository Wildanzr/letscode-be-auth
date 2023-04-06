const Joi = require('joi')

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
  confirmPassword: Joi.ref('password'),
  fullName: Joi.string().min(3).max(1000).required(),
  gender: Joi.boolean().truthy('true', 'yes', 1, '1').falsy('false', 'no', 0, '0').required(),
  dateOfBirth: Joi.date().required(),
  role: Joi.number().required().valid(0, 1)
})

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(8).max(100).required(),
  remember: Joi.boolean().truthy('true', 'yes', 1, '1').falsy('false', 'no', 0, '0').required()
})

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
})

const verifyAccountSchema = Joi.object({
  token: Joi.string().required()
})

const checkTokenSchema = Joi.object({
  token: Joi.string().required()
})

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).max(100).required(),
  confirmPassword: Joi.ref('password')
})

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).max(100).required(),
  newPassword: Joi.string().min(8).max(100).required(),
  confirmNewPassword: Joi.ref('newPassword')
})

const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(3).max(1000).required(),
  username: Joi.string().min(3).max(50).required(),
  gender: Joi.boolean().truthy('true', 'yes', 1, '1').falsy('false', 'no', 0, '0').required(),
  dateOfBirth: Joi.date().required(),
  address: Joi.string().min(3).max(1000).allow(null),
  bio: Joi.string().min(3).max(1000).allow(null),
  phone: Joi.string().min(8).max(20).allow(null)
})

const checkUsernameSchema = Joi.object({
  username: Joi.string().min(3).max(50).required()
})

const checkEmailSchema = Joi.object({
  email: Joi.string().email().required()
})

const editPictureSchema = Joi.object({
  mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
  size: Joi.number().integer().max(10 * 1024 * 1024).required()
})

const travelPathSchema = Joi.object({
  path: Joi.string().required()
})

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyAccountSchema,
  checkTokenSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  checkUsernameSchema,
  checkEmailSchema,
  editPictureSchema,
  travelPathSchema
}

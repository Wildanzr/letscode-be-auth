// const { ClientError } = require('../errors')

class UserController {
  constructor (userService, validtor, response, hashPassword, tokenize) {
    this._userService = userService
    this._validator = validtor
    this._response = response
    this._hashPassword = hashPassword
    this._tokenize = tokenize

    this.updateProfile = this.updateProfile.bind(this)
    this.editAvatar = this.editAvatar.bind(this)
  }

  async updateProfile (req, res) {
    try {
      // Check token is exist

      // Validate token

      // Validate payload

      // Find user

      // Check user is verified

      // Update user

      // Response

      return res.status(200).json({ message: 'Update profile!' })
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async editAvatar (req, res) {
    try {
      // Check token is exist

      // Validate token

      // Validate payload

      // Find user

      // Check user is verified

      // Upload avatar

      // Update user

      // Response
      return res.status(200).json({ message: 'Edit avatar!' })
    } catch (error) {
      return this._response.error(res, error)
    }
  }
}

module.exports = {
  UserController
}

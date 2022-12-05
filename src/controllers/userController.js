const { ClientError } = require('../errors')

class UserController {
  constructor (userService, validtor, response, hashPassword, tokenize) {
    this._userService = userService
    this._validator = validtor
    this._response = response
    this._hashPassword = hashPassword
    this._tokenize = tokenize

    // Bind method
    this.updateProfile = this.updateProfile.bind(this)
    this.editAvatar = this.editAvatar.bind(this)
    this.checkUsernameIsTaken = this.checkUsernameIsTaken.bind(this)
    this.checkEmailIsTaken = this.checkEmailIsTaken.bind(this)
  }

  async updateProfile (req, res) {
    const payload = req.body
    const token = req.headers.authorization

    try {
      // Check token is exist
      if (!token) throw new ClientError('Invalid authorization.', 401)

      // Validate token
      const decode = await this._tokenize.verify(token)

      // Validate payload
      this._validator.validateUpdateProfile(payload)

      // Find user
      const { _id } = decode
      const user = await this._userService.getUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 404)

      // Check user is verified
      if (!user.isVerified) throw new ClientError('Sorry, ypur account is not verified ye. Please verify your account first.', 401)

      // Update user
      await this._userService.updateUser(_id, payload)

      // Response
      const response = this._response.success(200, 'Your profile has been updated.')

      return res.status(response.statusCode || 200).json(response)
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

  async checkUsernameIsTaken (req, res) {
    const { username } = req.query

    try {
      // Validate payload
      this._validator.validateCheckUsername({ username })

      // Check username is taken
      const isTaken = await this._userService.checkUsernameIsTaken(username)

      // Response
      const response = this._response.success(200, 'Check username success.', { isTaken })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async checkEmailIsTaken (req, res) {
    const { email } = req.query

    try {
      // Validate payload
      this._validator.validateCheckEmail({ email })

      // Check email is taken
      const isTaken = await this._userService.checkEmailIsTaken(email)

      // Response
      const response = this._response.success(200, 'Check email success.', { isTaken })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }
}

module.exports = {
  UserController
}

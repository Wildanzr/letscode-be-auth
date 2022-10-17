const { ClientError } = require('../errors')

class AuthController {
  constructor (authService, userService, validator, response, hashPassword, tokenize) {
    this._authService = authService
    this._userService = userService
    this._validator = validator
    this._response = response
    this._hashPassword = hashPassword
    this._tokenize = tokenize

    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.about = this.about.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this)
    this.checkToken = this.checkToken.bind(this)
    this.resetPassword = this.resetPassword.bind(this)
    this.changePassword = this.changePassword.bind(this)
  }

  async register (req, res) {
    const payload = req.body
    const { username, email, password, fullName, gender, dateOfBirth, role } = payload

    try {
      // Validate payload
      this._validator.validateRegister(payload)

      // Check duplicate username or email
      await this._authService.checkDuplicate(username, email)

      // Hash password
      const hash = await this._hashPassword.hash(password)

      // Create user
      await this._authService.createUser({ username, email, password: hash, fullName, gender, dateOfBirth, role })

      // Create token for verify account

      // Send email for verify account

      // Return response
      const response = this._response.success(201, 'Register success, please check your email to verify your account!.')

      return res.status(response.statusCode).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async login (req, res) {
    const payload = req.body
    const { username, password, remember } = payload

    try {
      // Validate payload
      this._validator.validateLogin(payload)

      // Check user or email
      let user = null
      await Promise.all([
        await this._userService.getUserByUsername(username),
        await this._userService.getUserByEmail(username)
      ]).then(res => {
        if (res[0]) user = res[0]
        else if (res[1]) user = res[1]
      })
      if (!user) throw new ClientError('You have entered an invalid username or password.', 400)

      // Check account is verified
      if (!user.isVerified) throw new ClientError('Your account is not verified, please check your email to verify your account.', 401)

      // Check password
      if (!await this._hashPassword.compare(password, user.password)) {
        throw new ClientError('You have entered an invalid username or password', 400)
      }

      // Create token
      const accessToken = await this._tokenize.sign(user, remember)

      // Return response
      const response = this._response.success(200, 'Login success.', { accessToken })

      return res.status(response.statusCode).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async about (req, res) {
    const token = req.headers.authorization
    try {
      // Check token
      if (!token) throw new ClientError('Invalid authorization.', 401)

      // Verify token
      const decode = await this._tokenize.verify(token)

      // Get user details
      const user = await this._authService.getUserAuth(decode)

      // Return response
      const response = this._response.success(200, 'Auth details success.', { user })

      return res.status(response.statusCode).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async forgotPassword (req, res) {
    const payload = req.body
    const { email } = payload

    try {
      // Validate payload
      this._validator.validateForgotPassword(payload)

      // Check email
      const user = await this._userService.getUserByEmail(email)
      if (!user) throw new ClientError('Email not found.', 404)

      // Check if there is active token for this user, if not generate new token
      let tokenData = await this._authService.getTokenByEmail(email)
      if (!tokenData) tokenData = await this._authService.createToken(email)

      // Send email

      // Return response
      const response = this._response.success(200, 'Please check your email to reset your password.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async checkToken (req, res) {
    try {
      // Validate payload

      // Check token

      // Return response
      return res.status(200).json({ message: 'Check Token' })
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async resetPassword (req, res) {
    try {
      // Validate payload

      // Check token

      // Hash password

      // Update password

      // Return response
      return res.status(200).json({ message: 'Reset password' })
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async changePassword (req, res) {
    try {
      // Check token is exist

      // Validate token

      // Validate payload

      // Find user

      // Check user is verified

      // Compare old password

      // Hash password

      // Return response
      return res.status(200).json({ message: 'Change password' })
    } catch (error) {
      return this._response.error(res, error)
    }
  }
}

module.exports = {
  AuthController
}

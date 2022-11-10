const { ClientError } = require('../errors')

class AuthController {
  constructor (authService, userService, producer, validator, response, hashPassword, tokenize) {
    this._authService = authService
    this._userService = userService
    this._producer = producer
    this._validator = validator
    this._response = response
    this._hashPassword = hashPassword
    this._tokenize = tokenize

    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.about = this.about.bind(this)
    this.verifyAccount = this.verifyAccount.bind(this)
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
      const TokenData = await this._authService.createToken(email)
      const { token } = TokenData

      // Send email for verify account
      const clientUrl = process.env.CLIENT_HOST
      const mail = {
        message: {
          name: fullName,
          email,
          link: `${clientUrl}/auth/activate?token=${token}`
        },
        subject: 'Glad to have you on board, please verify your account',
        template: 'register'
      }

      await this._producer.sendMessage('mail', mail)

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

  async verifyAccount (req, res) {
    const query = req.query

    try {
      // Check token is exist
      const { token } = query
      if (!token) throw new ClientError('Invalid token.', 401)

      // Validate payload
      this._validator.validateVerifyAccount(query)

      // Validate token
      const tokenData = await this._authService.getTokenByToken(token)
      if (!tokenData) throw new ClientError('Invalid token.', 401)

      // Find user
      const { email } = tokenData
      const user = await this._userService.getUserByEmail(email)
      if (!user) throw new ClientError('Invalid token.', 401)

      // Verify user
      user.isVerified = true
      user.verifiedAt = new Date()
      await user.save()

      // Delete token
      await this._authService.deleteToken(token)

      // Response
      const response = this._response.success(200, 'Your account has been verified.')

      return res.status(response.statusCode || 200).json(response)
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

      const { token } = tokenData
      const { fullName } = user

      // Send email
      // Send email for verify account
      const mail = {
        message: {
          name: fullName,
          email,
          link: `http://localhost:5173/api/v1/auth/reset-password?token=${token}`
        },
        subject: 'Reset password instruction',
        template: 'forgot'
      }

      await this._producer.sendMessage('mail', mail)

      // Return response
      const response = this._response.success(200, 'Please check your email to reset your password.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async checkToken (req, res) {
    const query = req.query
    const { token } = query
    try {
      // Validate payload
      this._validator.validateCheckToken({ token })

      // Check token
      const tokenData = await this._authService.getTokenByToken(token)

      const isTokenValid = !!tokenData

      // Return response
      const response = this._response.success(200, isTokenValid ? 'Token is valid.' : 'Token not valid', { isTokenValid })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async resetPassword (req, res) {
    const { password, confirmPassword } = req.body
    const { token } = req.query

    try {
      // Validate payload
      this._validator.validateResetPassword({ token, password, confirmPassword })

      // Check token
      const tokenData = await this._authService.getTokenByToken(token)
      if (!tokenData) throw new ClientError('Invalid token.', 401)

      // Hash password
      const hashed = await this._hashPassword.hash(password)

      // Update password
      const { email } = tokenData
      await this._userService.updatePassword(email, hashed)

      // Delete token
      await this._authService.deleteToken(token)

      // Return response
      const response = this._response.success(200, 'Your password has been reset.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async changePassword (req, res) {
    const payload = req.body
    const token = req.headers.authorization

    try {
      // Check token is exist
      if (!token) throw new ClientError('Invalid authorization.', 401)

      // Validate token
      const decode = await this._tokenize.verify(token)

      // Validate payload
      this._validator.validateChangePassword(payload)

      // Find user
      const { _id } = decode
      const user = await this._userService.getUserById(_id)
      if (!user) throw new ClientError('Invalid token.', 401)

      // Check user is verified
      if (!user.isVerified) throw new ClientError('Your account is not verified, please check your email to verify your account.', 401)
      const { password, email } = user

      // Compare old password
      const { oldPassword, newPassword } = payload
      if (!await this._hashPassword.compare(oldPassword, password)) {
        throw new ClientError('Old password is not correct.', 400)
      }

      // Hash password
      const hashed = await this._hashPassword.hash(newPassword)

      // Update password
      await this._userService.updatePassword(email, hashed)

      // Return response
      const response = this._response.success(200, 'Your password has been changed.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }
}

module.exports = {
  AuthController
}

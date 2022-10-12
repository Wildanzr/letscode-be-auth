const ClientError = require('../errors/clientError')

class AuthController {
  constructor (userService, validtor, response, hashPassword, tokenize) {
    this._userService = userService
    this._validator = validtor
    this._response = response
    this._hashPassword = hashPassword
    this._tokenize = tokenize
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.about = this.about.bind(this)
  }

  async register (req, res) {
    const payload = req.body
    const { username, email, password, fullName, dateOfBirth } = payload

    try {
      // Validate payload
      this._validator.validateRegister(payload)

      // Check duplicate username or email
      await this._userService.checkDuplicate(username, email)

      // Hash password
      const hash = await this._hashPassword.hash(password)

      // Create user
      const user = await this._userService.createUser({ username, email, password: hash, fullName, dateOfBirth })

      // Return response
      const response = this._response.success(201, 'User created successfully.', user)

      return res.status(response.statusCode).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async login (req, res) {
    const payload = req.body
    const { username, password } = payload

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

      // Check password
      if (!await this._hashPassword.compare(password, user.password)) {
        throw new ClientError('You have entered an invalid username or password', 400)
      }

      // Create token
      const accessToken = await this._tokenize.sign(user)

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
      const user = await this._userService.getUserAuth(decode)

      // Return response
      const response = this._response.success(200, 'Auth details success.', { user })

      return res.status(response.statusCode).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }
}

module.exports = AuthController

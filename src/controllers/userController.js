class UserController {
  constructor (userService, validtor, response, hashPassword) {
    this._userService = userService
    this._validator = validtor
    this._response = response
    this._hashPassword = hashPassword
    this.register = this.register.bind(this)
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
      const response = this._response.success(201, 'User created successfully', user)

      return res.status(response.status).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }
}

module.exports = UserController

// const ClientError = require('../errors/clientError')

class UserController {
  constructor (userService, validtor, response, hashPassword, tokenize) {
    this._userService = userService
    this._validator = validtor
    this._response = response
    this._hashPassword = hashPassword
    this._tokenize = tokenize
  }

  async updateProfile (req, res) {
    const payload = req.body

    try {
      return res.status(200).json({ payload })
    } catch (error) {
      return this._response.error(res, error)
    }
  }
}

module.exports = UserController

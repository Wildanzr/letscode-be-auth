const jwt = require('jsonwebtoken')
const ClientError = require('../errors/clientError')

class Tokenize {
  constructor () {
    this.name = 'Tokenize'
    this.sign = this.sign.bind(this)
    this.verify = this.verify.bind(this)
  }

  async sign (user) {
    const { _id } = user
    return jwt.sign({
      _id
    }, process.env.SECRET || 'secret', { expiresIn: '1h' })
  }

  async verify (token) {
    token = token.replace('Bearer ', '')
    try {
      return jwt.verify(token, process.env.SECRET || 'secret')
    } catch (error) {
      throw new ClientError('Invalid authorization', 401)
    }
  }
}

module.exports = Tokenize

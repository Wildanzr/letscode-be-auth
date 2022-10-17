const jwt = require('jsonwebtoken')
const { ClientError } = require('../errors')

class Tokenize {
  constructor () {
    this.name = 'Tokenize'
  }

  async sign (user, duration) {
    const { _id } = user
    return jwt.sign({
      _id
    }, process.env.SECRET || 'secret', { expiresIn: duration ? '7d' : '1d' })
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

module.exports = {
  Tokenize
}

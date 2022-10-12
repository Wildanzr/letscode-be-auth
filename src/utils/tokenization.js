const jwt = require('jsonwebtoken')

class Tokenize {
  constructor () {
    this.name = 'Tokenize'
    this.sign = this.sign.bind(this)
  }

  async sign (user) {
    const { _id } = user
    return jwt.sign({
      _id
    }, process.env.SECRET || 'secret', { expiresIn: '1h' })
  }
}

module.exports = Tokenize

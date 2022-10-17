const { User, Token } = require('../models')
const { ClientError } = require('../errors')
const crypto = require('crypto')

class AuthService {
  constructor () {
    this.name = 'authService'
  }

  async getTokenByToken (token) {
    return await Token.findOne({ token })
  }

  async getTokenByEmail (email) {
    return await Token.findOne({ email })
  }

  async createToken (email) {
    return await Token.create({
      email: email.toLowerCase(),
      token: crypto.randomBytes(20).toString('hex')
    })
  }

  async deleteToken (token) {
    return await Token.findOneAndDelete({ token })
  }

  async createUser (user) {
    return await User.create(user)
  }

  async getUserAuth (token) {
    const { _id } = token
    // To do : get another user data
    return await this.getUserById(_id)
  }

  async checkDuplicate (username, email) {
    const user = await User.findOne({ $or: [{ username }, { email }] })
    if (user) throw new ClientError('Username or email already exists.', 400)
  }
}

module.exports = {
  AuthService
}

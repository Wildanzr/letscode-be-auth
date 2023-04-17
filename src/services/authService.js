const { User, Token } = require('../models')
const { ClientError } = require('../errors')
const crypto = require('crypto')

const { logger } = require('../utils/logger')

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
    return await User.findOne({ _id }).select('_id username email fullName role avatar').lean()
  }

  async checkDuplicate (username, email) {
    const user = await User.findOne({ $or: [{ username }, { email }] })
    if (user) throw new ClientError('Username atau email sudah ada.', 400)
  }

  async initSuperAdmin (payload) {
    const { username, email } = payload
    try {
      logger.info('Start init super admin...')
      // Check if super admin already exist
      logger.info('Checking if super admin already exist...')
      if (await this.checkDuplicate(username, email)) return

      // Create super admin
      logger.info('Creating super admin...')
      await this.createUser(payload)

      logger.info('Init super admin success.')
    } catch (error) {
      logger.warn(error)
    }
  }
}

module.exports = {
  AuthService
}

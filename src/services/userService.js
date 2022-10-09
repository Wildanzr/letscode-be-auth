const User = require('../models/user')
const ClientError = require('../errors/clientError')

class UserService {
  constructor () {
    this.getUser = this.getUser.bind(this)
    this.createUser = this.createUser.bind(this)
    this.updateUser = this.updateUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.checkDuplicate = this.checkDuplicate.bind(this)
  }

  async getUser (username) {
    return await User.findOne({ username })
  }

  async createUser (user) {
    return await User.create(user)
  }

  async updateUser (username, user) {
    return await User.findOneAndUpdate({ username }, user, { new: true })
  }

  async deleteUser (username) {
    return await User.findOneAndDelete({ username })
  }

  async checkDuplicate (username, email) {
    const user = await User.findOne({ $or: [{ username }, { email }] })
    if (user) throw new ClientError('Username or email already exists.', 400)
  }
}

module.exports = UserService

const User = require('../models/user')

class UserService {
  constructor () {
    this.getUser = this.getUser.bind(this)
    this.createUser = this.createUser.bind(this)
    this.updateUser = this.updateUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
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
}

module.exports = UserService

const { User } = require('../models/user')
// const { ClientError } = require('../errors')

class UserService {
  constructor () {
    this.name = 'UserService'
  }

  async getUserByUsername (username) {
    return await User.findOne({ username: username.toLowerCase() })
  }

  async getUserByEmail (email) {
    return await User.findOne({ email: email.toLowerCase() })
  }

  async getUserById (id) {
    return await User.findOne({ _id: id })
  }

  async updateUser (username, user) {
    return await User.findOneAndUpdate({ username }, user, { new: true })
  }

  async updatePassword (email, hashed) {
    return await User.findOneAndUpdate({ email }, { password: hashed }, { new: true })
  }

  async deleteUser (username) {
    return await User.findOneAndDelete({ username })
  }
}

module.exports = {
  UserService
}

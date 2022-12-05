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

  async updatePassword (email, hashed) {
    return await User.findOneAndUpdate({ email }, { password: hashed }, { new: true })
  }

  async updateUser (id, payload) {
    const { fullName, email, gender, dateOfBirth } = payload
    return await User.findOneAndUpdate({ _id: id }, { fullName, email, gender, dateOfBirth }, { new: true })
  }

  async deleteUser (username) {
    return await User.findOneAndDelete({ username })
  }

  async checkUsernameIsTaken (username) {
    const user = await User.findOne({ username: username.toLowerCase() })
    return !!user
  }

  async checkEmailIsTaken (email) {
    const user = await User.findOne({ email: email.toLowerCase() })
    return !!user
  }
}

module.exports = {
  UserService
}

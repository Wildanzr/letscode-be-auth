const { User } = require('../models/user')
const { ClientError } = require('../errors')

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

  async checkUsernameOrEmail (username) {
    // Check user or email
    const user = await Promise.all([
      await this._userService.getUserByUsername(username),
      await this._userService.getUserByEmail(username)
    ])

    console.log(user)

    if (user[0]) return user[0]
    else if (user[1]) return user[1]
    else return null
  }

  async getUserAuth (token) {
    const { _id } = token
    // To do : get another user data
    return await this.getUserById(_id)
  }
}

module.exports = {
  UserService
}

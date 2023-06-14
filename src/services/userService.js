const { User, TravelLog, Compete, CompeteProblem } = require('../models')
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

  async updatePassword (email, hashed) {
    return await User.findOneAndUpdate({ email }, { password: hashed }, { new: true })
  }

  async updateUser (id, payload) {
    return await User.findOneAndUpdate({ _id: id }, payload, { new: true })
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

  async getProfile (username) {
    const user = await User.findOne({ username: username.toLowerCase() })
      .select('username fullName gender dateOfBirth point avatar email bio address phone role')
      .exec()
    if (!user) throw new ClientError('Data user tidak ditemukan.', 404)
    return user
  }

  async addToTravelLog (payload) {
    const { userId, path, from, to, mode } = payload
    // Determine path is
    const pathType = path.includes('->compete')
      ? 'compete'
      : path.includes('->cp')
        ? 'cp'
        : path.includes('->')
          ? 'user'
          : 'none'

    let newPath = path
    const id = path.split('->')[1]
    switch (pathType) {
      case 'compete':
        newPath = path.split('->compete')[0] + await this.determineCompete(id)
        break
      case 'cp':
        newPath = path.split('->cp')[0] + await this.determineCompeteProblem(id)
        break
      case 'user':
        newPath = path.split('->')[0] + id
        break
      default:
        newPath = path
        break
    }

    return await TravelLog.create({ userId, path: newPath, from, to, mode })
  }

  async determineCompete (competeId) {
    const compete = await Compete.findOne({ _id: competeId }).select('name').lean()

    return compete.name
  }

  async determineCompeteProblem (cpId) {
    const cp = await CompeteProblem.findOne({ _id: cpId })
      .populate('problemId')
      .select('problemId')
      .lean()

    return cp.problemId.title
  }
}

module.exports = {
  UserService
}

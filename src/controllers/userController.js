class UserController {
  constructor (userService) {
    this.userService = userService
    this.createUser = this.createUser.bind(this)
  }

  async createUser (req, res) {
    const payload = req.body

    console.log(payload)

    return res.json(payload)
  }
}

module.exports = UserController

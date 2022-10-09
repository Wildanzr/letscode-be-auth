const express = require('express')

class UserRoutes {
  constructor (userController) {
    this.router = express.Router()
    this._userController = userController

    this.router.post('/register', this._userController.createUser)
  }
}

module.exports = UserRoutes

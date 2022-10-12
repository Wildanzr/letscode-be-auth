const express = require('express')

class AuthRoutes {
  constructor (userController) {
    this.router = express.Router()
    this._userController = userController

    this.router.post('/register', this._userController.register)
    this.router.post('/login', this._userController.login)
  }
}

module.exports = AuthRoutes

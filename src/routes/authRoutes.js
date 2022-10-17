const express = require('express')

class AuthRoutes {
  constructor (authController) {
    this.router = express.Router()
    this._userController = authController

    this.router.post('/register', this._userController.register)
    this.router.post('/login', this._userController.login)
    this.router.get('/me', this._userController.about)
  }
}

module.exports = {
  AuthRoutes
}

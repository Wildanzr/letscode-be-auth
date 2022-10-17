const express = require('express')

class AuthRoutes {
  constructor (authController) {
    this.router = express.Router()
    this._authController = authController

    this.router.post('/register', this._authController.register)
    this.router.post('/login', this._authController.login)
    this.router.get('/me', this._authController.about)
    this.router.post('/forgot-password', this._authController.forgotPassword)
    this.router.get('/reset-password', this._authController.checkToken)
    this.router.post('/reset-password', this._authController.resetPassword)
    this.router.post('/change-password', this._authController.changePassword)
  }
}

module.exports = {
  AuthRoutes
}

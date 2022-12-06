const express = require('express')

class UserRoutes {
  constructor (userController) {
    this.router = express.Router()
    this._userController = userController

    this.router.post('/profile', this._userController.updateProfile)
    this.router.get('/profile/:username', this._userController.getProfile)
    this.router.post('/avatar', this._userController.editAvatar)
    this.router.get('/username', this._userController.checkUsernameIsTaken)
    this.router.get('/email', this._userController.checkEmailIsTaken)
  }
}

module.exports = {
  UserRoutes
}

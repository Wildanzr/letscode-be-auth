const express = require('express')

class UserRoutes {
  constructor (userController) {
    this.router = express.Router()
    this._userController = userController

    this.router.put('/profile', this._userController.updateProfile)
    this.router.get('/profile/:username', this._userController.getProfile)
    this.router.post('/avatar', this._userController.editAvatar)
    this.router.get('/username', this._userController.checkUsernameIsTaken)
    this.router.get('/email', this._userController.checkEmailIsTaken)
    this.router.post('/travel', this._userController.travelLog)
  }
}

module.exports = {
  UserRoutes
}

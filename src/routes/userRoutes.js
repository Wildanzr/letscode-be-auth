const express = require('express')

class UserRoutes {
  constructor (userController) {
    this.router = express.Router()
    this._userController = userController

    this.router.post('/profile', this._userController.updateProfile)
    this.router.post('/avatar', this._userController.editAvatar)
  }
}

module.exports = {
  UserRoutes
}

const express = require('express')

class UserRoutes {
  constructor (userController) {
    this.router = express.Router()
    this._userController = userController

    this.router.get('/update', this._userController.updateProfile)
  }
}

module.exports = UserRoutes

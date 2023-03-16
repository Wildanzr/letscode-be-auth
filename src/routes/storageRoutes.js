const express = require('express')
class StorageRoutes {
  constructor (userController) {
    this.router = express.Router()
    this._userController = userController

    this.router.get('/uploads/:fileName', this._userController.getAvatar)
  }
}

module.exports = {
  StorageRoutes
}

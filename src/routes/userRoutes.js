const express = require('express')

class UserRoutes {
  constructor (userController) {
    this.userController = userController
    this.router = express.Router()
    this.routes = this.routes.bind(this)
  }

  routes () {
    this.router.post('/register', this.userController.createUser)
  }
}

module.exports = UserRoutes

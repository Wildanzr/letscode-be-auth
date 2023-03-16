const express = require('express')
const multer = require('multer')
const path = require('path')

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
})
class UserRoutes {
  constructor (userController) {
    this.router = express.Router()
    this._userController = userController

    this.router.put('/profile', this._userController.updateProfile)
    this.router.get('/profile/:username', this._userController.getProfile)
    this.router.get('/uploads/:fileName', this._userController.getAvatar)
    this.router.post('/avatar', upload.single('files'), this._userController.editAvatar)
    this.router.get('/username', this._userController.checkUsernameIsTaken)
    this.router.get('/email', this._userController.checkEmailIsTaken)
    this.router.post('/travel', this._userController.travelLog)
  }
}

module.exports = {
  UserRoutes
}

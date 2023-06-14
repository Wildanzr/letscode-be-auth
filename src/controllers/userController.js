const { ClientError } = require('../errors')
const path = require('path')
const fs = require('fs')
const { logger } = require('../utils/logger')

class UserController {
  constructor (userService, competeService, validtor, response, hashPassword, tokenize) {
    this._userService = userService
    this._competeService = competeService
    this._validator = validtor
    this._response = response
    this._hashPassword = hashPassword
    this._tokenize = tokenize

    // Bind method
    this.updateProfile = this.updateProfile.bind(this)
    this.editAvatar = this.editAvatar.bind(this)
    this.checkUsernameIsTaken = this.checkUsernameIsTaken.bind(this)
    this.checkEmailIsTaken = this.checkEmailIsTaken.bind(this)
    this.getProfile = this.getProfile.bind(this)
    this.travelLog = this.travelLog.bind(this)
    this.getAvatar = this.getAvatar.bind(this)
  }

  async updateProfile (req, res) {
    const payload = req.body
    const token = req.headers.authorization

    try {
      // Check token is exist
      if (!token) throw new ClientError('Otorisasi tidak valid.', 401)

      // Validate token
      const { _id } = await this._tokenize.verify(token)

      // Validate payload
      this._validator.validateUpdateProfile(payload)

      // Find user
      const user = await this._userService.getUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 404)

      // Check user is verified
      if (!user.isVerified) throw new ClientError('Akunmu masih belum terverifikasi, mohon membuka pesan email untuk mengkonfirmasi akunmu!', 401)

      // Update user
      await this._userService.updateUser(_id, payload)

      // Response
      const response = this._response.success(200, 'Berhasil memperbarui profil.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async editAvatar (req, res) {
    const token = req.headers.authorization
    const file = req.file

    try {
      // Check token is exist
      if (!token) throw new ClientError('Otorisasi tidak valid.', 401)

      // Validate token
      const { _id } = await this._tokenize.verify(token)

      // Find user
      const user = await this._userService.getUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 404)

      // Check file is exists
      if (!file) throw new ClientError('Mohon mengupload file foto profil!', 400)

      if (!file.mimetype.startsWith('image')) {
        fs.unlink(file.path, (err) => {
          if (err) {
            throw new ClientError('Terjadi kesalahan saat menghapus file foto profil!', 500)
          }
        })
      }

      // Validate mime type and file size
      const { mimetype, size } = file
      this._validator.validateEditPicture({ mimetype, size })

      const fileName = `${process.env.BACKEND_HOST}/storage/uploads/files${file.path.split('files')[1]}`

      // Delete old avatar
      if (user.avatar.includes('storage')) {
        const oldAvatar = user.avatar.split('/storage')[1]
        fs.unlink(path.join(__dirname, `../public${oldAvatar}`), (err) => {
          if (err) {
            logger.error(err)
          } else {
            logger.info('Old avatar deleted!')
          }
        })
      }

      // Update user profile picture
      user.avatar = fileName
      await user.save()

      // Send response
      const response = this._response.success(200, 'Berhasil memperbarui foto profil!')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async getAvatar (req, res) {
    const { fileName } = req.params

    try {
      const options = {
        root: path.join(__dirname, '../public/uploads')
      }

      res.sendFile(fileName, options, function (err) {
        if (err) {
          logger.error(err)
          res.status(404).end()
        }
      })
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async checkUsernameIsTaken (req, res) {
    const { username } = req.query

    try {
      // Validate payload
      this._validator.validateCheckUsername({ username })

      // Check username is taken
      const isTaken = await this._userService.checkUsernameIsTaken(username)

      // Response
      const response = this._response.success(200, 'Berhasil mengecek username.', { isTaken })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async checkEmailIsTaken (req, res) {
    const { email } = req.query

    try {
      // Validate payload
      this._validator.validateCheckEmail({ email })

      // Check email is taken
      const isTaken = await this._userService.checkEmailIsTaken(email)

      // Response
      const response = this._response.success(200, 'Berhasil mengecek email.', { isTaken })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async getProfile (req, res) {
    const { username } = req.params

    try {
      // Validate payload
      this._validator.validateCheckUsername({ username })

      // Find user
      const user = await this._userService.getProfile(username)

      // Get all compete journeys
      const journeys = await this._competeService.getAllJourneys()

      // Count progress
      let solved = 0
      let total = 0

      // Iterate journeys
      for (const journey of journeys) {
        const { problems } = journey
        total += problems.length

        // Iterate problems
        for (const problem of problems) {
          const isDone = await this._competeService.checkCPIsDone(problem, user._id)
          if (isDone === 2) solved++
        }
      }

      // Count progress as percentage with 2 decimal places
      const progress = parseFloat((solved / total * 100).toFixed(2))

      // Payload
      const journey = {
        progress,
        point: user.point
      }

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan profil.', { user, journey })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async travelLog (req, res) {
    const token = req.headers.authorization
    const { path, from, to, mode } = req.query

    try {
      // Check token is exist
      if (!token) throw new ClientError('Otorisasi tidak valid.', 401)

      // Validate token
      const { _id } = await this._tokenize.verify(token)

      // Find user
      const user = await this._userService.getUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 404)

      // Validate payload
      this._validator.validateTravelPath({ path, from, to, mode })

      // Add to log
      await this._userService.addToTravelLog({ userId: _id, path, from, to, mode })

      // Response
      const response = this._response.success(200, 'Travel log berhasil diperbarui.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }
}

module.exports = {
  UserController
}

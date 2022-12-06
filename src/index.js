require('dotenv').config()
const multer = require('multer')

// Database
const mongoose = require('mongoose')

// Cors
const cors = require('cors')

// Service
const { UserService, AuthService, Producer, CompeteService, StorageService } = require('./services')
const userService = new UserService()
const authService = new AuthService()
const producer = new Producer()
const competeService = new CompeteService()
const storageService = new StorageService()

// Utils
const { Response, HashPassword, Tokenize } = require('./utils')
const response = new Response()
const hashPassword = new HashPassword()
const tokenize = new Tokenize()

// Validator
const { Validator } = require('./validators')
const validator = new Validator()

// Controller
const { AuthController, UserController } = require('./controllers')
const authController = new AuthController(authService, userService, producer, validator, response, hashPassword, tokenize)
const userController = new UserController(userService, storageService, competeService, validator, response, hashPassword, tokenize)

// Routes
const { AuthRoutes, UserRoutes } = require('./routes')
const userRoutes = new UserRoutes(userController)
const authRoutes = new AuthRoutes(authController)

// Init express
const express = require('express')
const app = express()

// Init body-parser
app.use(express.json())

// Cors
app.use(cors())

// Create multer middleware
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
})

// Use multer middleware
app.use(multerMid.single('files', 5))

// Catch error when file is too large
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const payload = response.fail(400, 'File is too large, max size is 5mb.')

    return res.status(400).json(payload)
  }
})

// Connect to mongodb
mongoose.connect(process.env.DATABASE_URL, {
  useNewURLParser: true,
  useUnifiedTopology: true
}).then(console.log('connected to db')).catch((err) => console.log(err))

// Use routes
app.use('/api/v1/auth', authRoutes.router)
app.use('/api/v1/user', userRoutes.router)

// Set port, listen for requests
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

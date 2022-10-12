// Database
const mongoose = require('mongoose')

// Cors
const cors = require('cors')

// Service
const UserService = require('./services/userService')
const userService = new UserService()

// Utils
const Response = require('./utils/response')
const HashPassword = require('./utils/hashPassword')
const Tokenize = require('./utils/tokenization')
const response = new Response()
const hashPassword = new HashPassword()
const tokenize = new Tokenize()

// Controller
const AuthController = require('./controllers/authController')
const UserController = require('./controllers/userController')

// Routes
const AuthRoutes = require('./routes/authRoutes')
const UserRoutes = require('./routes/userRoutes')

// Validator
const Validator = require('./validators')
const validator = new Validator()

// Auth Routes
const authController = new AuthController(userService, validator, response, hashPassword, tokenize)
const authRoutes = new AuthRoutes(authController)

// User Routes
const userController = new UserController(userService, validator, response, hashPassword, tokenize)
const userRoutes = new UserRoutes(userController)

// Init express
require('dotenv').config()
const express = require('express')
const app = express()

// Init body-parser
app.use(express.json())

// Cors
app.use(cors())

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

// Database
const mongoose = require('mongoose')

// Cors
const cors = require('cors')

// Service
const UserService = require('./services/UserService')

// Utils
const Response = require('./utils/response')
const HashPassword = require('./utils/hashPassword')
const Tokenize = require('./utils/tokenization')
const response = new Response()
const hashPassword = new HashPassword()
const tokenize = new Tokenize()

// Controller
const AuthController = require('./controllers/authController')

// Routes
const AuthRoutes = require('./routes/authRoutes')

// Validator
const Validator = require('./validators')
const validator = new Validator()

// User Routes
const userService = new UserService()
const authController = new AuthController(userService, validator, response, hashPassword, tokenize)
const authRoutes = new AuthRoutes(authController)

// Auth Routes

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

// Set port, listen for requests
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

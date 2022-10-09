// Database
const mongoose = require('mongoose')

// Cors
const cors = require('cors')

// Service
const UserService = require('./services/UserService')

// Utils

// Controller
const UserController = require('./controllers/UserController')

// Routes
const UserRoutes = require('./routes/userRoutes')

// User Routes
const userService = new UserService()
const userController = new UserController(userService)
const userRoutes = new UserRoutes(userController)

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
app.use('/api/v1/users', userRoutes.router)

// Set port, listen for requests
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

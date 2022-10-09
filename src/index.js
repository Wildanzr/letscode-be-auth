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

// Init express
require('dotenv').config()
const express = require('express')
const app = express()

// Init body-parser
app.use(express.json())

// Cors
app.use(cors())

// Connect to mongodb
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

// Use routes
app.use('/api/v1/users', userRoutes.routes)

// Simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the application.' })
})

// Set port, listen for requests
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

// Database
const mongoose = require('mongoose')

// Cors
const cors = require('cors')

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

// Simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the application.' })
})

// Set port, listen for requests
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

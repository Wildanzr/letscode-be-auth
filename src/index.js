// Cors
const cors = require('cors')

// Init express
const express = require('express')
const app = express()

// Init body-parser
app.use(express.json())

// Cors
app.use(cors())

// Simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the application.' })
})

// Set port, listen for requests
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

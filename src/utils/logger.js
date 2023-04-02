function logger (message) {
  const timestamp = new Date().toLocaleString()
  console.log(`${timestamp} - ${message}`)
}

module.exports = {
  logger
}

const amqp = require('amqplib')
const { ClientError } = require('../errors')
const { logger } = require('../utils/logger')

class Producer {
  constructor () {
    this.name = 'producer'
    this._connection = null
    this._channel = null
  }

  async sendMessage (queue, message) {
    try {
      // Create a connection to the RabbitMQ server
      const host = process.env.RABBITMQ_HOST || 'localhost'
      const port = process.env.RABBITMQ_PORT || 5672
      const user = process.env.RABBITMQ_USERNAME || 'guest'
      const password = process.env.RABBITMQ_PASSWORD || 'guest'

      this._connection = await amqp.connect(`amqp://${user}:${password}@${host}:${port}`)
      this._channel = await this._connection.createChannel()

      // Create the queue if it does not exist
      await this._channel.assertQueue(queue, { durable: true })

      // Send the message to the queue
      this._channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))

      // Close the connection
      setTimeout(() => {
        this._connection.close()
      }, 500)
    } catch (error) {
      logger.error(error)
      const message = error.message || 'Internal Server Error'
      const statusCode = error.statusCode || 500
      throw new ClientError(message, statusCode)
    }
  }
}

module.exports = {
  Producer
}

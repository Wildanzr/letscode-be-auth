const { model, Schema } = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 15)

const tokenSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `tkn-${nanoid(15)}` }
  },
  email: { type: String, required: true, lowercase: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: () => { return new Date() } }
})

// Add ttl index 7 days to createdAt
tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 })

// Create model
const Token = model('tokens', tokenSchema)

module.exports = {
  Token,
  tokenSchema
}

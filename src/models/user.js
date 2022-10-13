const mongoose = require('mongoose')
const { Schema } = mongoose
const { nanoid } = require('nanoid')

const userSchema = new Schema({
  _id: {
    type: String,
    default: `usr-${nanoid(15)}`
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    lowercase: true
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  fullName: { type: String, required: true },
  gender: { type: Boolean, required: true },
  dateOfBirth: { type: String, required: true },
  points: { type: Number, required: true, default: 0 },
  avatar: {
    type: String,
    default: `https://ui-avatars.com/api/?name=${this.username}`
  }
})

// Create model
const User = mongoose.model('users', userSchema)

module.exports = {
  User,
  userSchema
}

const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, minlength: 3, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  points: { type: Number, required: true, default: 0 },
  badges: { type: Array, required: true, default: [] },
  avatar: { type: String, required: true, default: function () { return `https://ui-avatars.com/api/?name=${this.username}` } }
})

module.exports = mongoose.model('user', userSchema)

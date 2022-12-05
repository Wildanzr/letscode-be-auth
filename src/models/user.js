const { model, Schema } = require('mongoose')
const { nanoid } = require('nanoid')

const userSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `usr-${nanoid(15)}` }
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    lowercase: true
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  gender: { type: Boolean, required: true },
  dateOfBirth: { type: Date, required: true },
  role: { type: Number, required: true },
  isVerified: { type: Boolean, default: false },
  verifiedAt: { type: Date, default: null },
  point: { type: Number, default: 0 },
  avatar: {
    type: String,
    default: (user) => { return `https://ui-avatars.com/api/?name=${user.username}` }
  },
  logActivities: [{ type: Schema.Types.String, ref: 'logs' }]
})

// Add index to fullName and username
userSchema.index({ fullName: 'text' })

// Add index to point
userSchema.index({ point: 1 })

// Create model
const User = model('users', userSchema)

module.exports = {
  User,
  userSchema
}

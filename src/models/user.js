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
    default: (user) => { return `https://ui-avatars.com/api/?name=${user.username}&size=400` }
  },
  logActivities: [{ type: Schema.Types.String, ref: 'logs' }],
  bio: { type: String, default: null },
  address: { type: String, default: null },
  phone: { type: String, default: null }
})

// Add index to username, email, fullName and role
userSchema.index({ username: 'text', email: 'text', fullName: 'text', role: 1, point: -1 })

// Create model
const User = model('users', userSchema)

module.exports = {
  User,
  userSchema
}

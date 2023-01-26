const { model, Schema } = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 15)

const competeSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `compete-${nanoid(15)}` }
  },
  challenger: { type: Schema.Types.String, ref: 'users', default: null },
  name: { type: String, required: true },
  start: { type: Date, default: null },
  end: { type: Date, default: null },
  key: { type: String, default: () => { return nanoid(5) }, unique: true },
  description: { type: String, required: true },
  isLearnPath: { type: Boolean, default: false },
  isChallenge: { type: Boolean, default: false },
  problems: [{ type: Schema.Types.String, ref: 'competeProblems' }],
  leaderboard: [{ type: Schema.Types.String, ref: 'competeLeaderboards' }],
  languageAllowed: { type: Array, required: true },
  participants: [{ type: Schema.Types.String, ref: 'users' }]
})

// Add index on name
competeSchema.index({ name: 'text' })

// Add index on isLearnPath
competeSchema.index({ isLearnPath: 1 })

// Create model
const Compete = model('competes', competeSchema)

module.exports = {
  Compete,
  competeSchema
}

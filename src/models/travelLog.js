const { model, Schema } = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 15)

const travelLogSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `tlog-${nanoid(15)}` }
  },
  userId: { type: Schema.Types.String, ref: 'users' },
  path: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  mode: { type: Number, required: true }
})

// Create model
const TravelLog = model('travelLogs', travelLogSchema)

module.exports = {
  TravelLog,
  travelLogSchema
}

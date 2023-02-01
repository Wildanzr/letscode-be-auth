const { model, Schema } = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 15)

const problemSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `pbl-${nanoid(15)}` }
  },
  challenger: { type: Schema.Types.String, ref: 'users' },
  title: { type: String, required: true, minlength: 3 },
  description: { type: String, required: true },
  difficulty: { type: Number, required: true },
  constraint: { type: String, required: true },
  inputFormat: { type: String, required: true },
  outputFormat: { type: String, required: true },
  sampleCases: [{ type: Schema.Types.String, ref: 'sampleCases', default: () => { return [] } }],
  testCases: [{ type: Schema.Types.String, ref: 'testCases', default: () => { return [] } }]
})

// Add index on title
problemSchema.index({ title: 'text' })

// Add index on difficulty
problemSchema.index({ difficulty: 1 })

// Create model
const Problem = model('problems', problemSchema)

module.exports = {
  Problem,
  problemSchema
}

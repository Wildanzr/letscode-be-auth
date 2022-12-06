const { model, Schema } = require('mongoose')
const { nanoid } = require('nanoid')

const problemSubmissionSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `ps-${nanoid(15)}` }
  },
  competeProblemId: { type: Schema.Types.String, ref: 'competeProblems', required: true },
  userId: { type: Schema.Types.String, ref: 'users', required: true },
  currentPoints: { type: Number, default: 0 },
  listOfSubmission: [{ type: Schema.Types.String, ref: 'submissions', default: [] }]
})

// add index to competeProblemId and userId
problemSubmissionSchema.index({ competeProblemId: 1, userId: 1 }, { unique: true })

// Create model
const ProblemSubmission = model('problemSubmissions', problemSubmissionSchema)

module.exports = {
  ProblemSubmission,
  problemSubmissionSchema
}

const { Compete, ProblemSubmission } = require('../models')

class CompeteService {
  constructor () {
    this.name = 'CompeteService'
  }

  async checkCPIsDone (competeProblemId, _id) {
    const submission = await ProblemSubmission.findOne({ competeProblemId, userId: _id }).exec()

    if (!submission) return 0
    else if (submission.currentPoints !== 100) return 1
    else return 2
  }

  async getAllJourneys () {
    const competes = await Compete.find({ isLearnPath: true })
      .sort({ name: 1 })
      .select('_id problems')
      .exec()

    return competes || []
  }
}

module.exports = {
  CompeteService
}

const { Storage } = require('@google-cloud/storage')
const path = require('path')

const PROJECT_ID = process.env.PROJECT_ID

const storage = new Storage({
  projectId: PROJECT_ID,
  keyFilename: path.join(__dirname, './keys.json')
})

module.exports = {
  storage
}

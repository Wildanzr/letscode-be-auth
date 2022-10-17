const bcrypt = require('bcrypt')

class HashPassword {
  constructor () {
    this.name = 'hashPassword'
  }

  async hash (password) {
    return await bcrypt.hash(password, 10)
  }

  async compare (password, hash) {
    return await bcrypt.compare(password, hash)
  }
}

module.exports = {
  HashPassword
}

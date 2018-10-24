const fs = require('fs')
const path = require('path')

function hasDWebFile () {
  return Boolean(fs.existsSync(path.join(process.cwd(), '.dweb')))
}

module.exports = {
  hasDWebFile
}

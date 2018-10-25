'use strict'

const fs = require('fs')
const path = require('path')

module.exports = (yargs) => {
  yargs.command('list', 'List the published versions', (yargs) => {
  }, (options) => {
    const projectConfigPath = path.join(process.cwd(), './.dweb')
    const projectConfig = JSON.parse(fs.readFileSync(projectConfigPath))

    projectConfig.versions.forEach((version) => {
      console.log(version.timestamp, version.cid)
    })
  })
}

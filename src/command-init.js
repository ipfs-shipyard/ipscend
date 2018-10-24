'use strict'

const fs = require('fs')
const { hasDWebFile } = require('./utils.js')
const { ask, choose } = require('asking')

module.exports = (yargs) => {
  yargs.command('init', 'Init your project', (yargs) => {}, (options) => {
    function init () {
      ask('Path to publish (where your webapp/page lives)?', { default: 'public' }, (err, path) => {
        if (err) { console.log(err.message) }

        const config = {
          versions: []
        }

        config.path = path
        const fd = fs.openSync(process.cwd() + '/.dweb', 'w')
        fs.writeSync(fd, JSON.stringify(config, null, '  '), 0, 'utf-8')
      })
    }

    if (hasDWebFile()) {
      choose('.dweb already exists, want to overwrite?', ['yes', 'no'], (err, answer) => {
        if (err) { return console.log(err.message) }
        if (answer === 'no') { process.exit() }
        init()
      })
    } else {
      init()
    }
  })
}

'use strict'

var Command = require('ronin').Command
var fs = require('fs')
var path = require('path')
var open = require('open')

module.exports = Command.extend({
  desc: 'Open your application in a browser',

  options: {
    version: 'string'
  },

  run: function (version, name) {
    if (version) {
      return browse(version)
    }
    var configPath
    try {
      configPath = path.resolve(process.cwd() + '/ipscend.json')
      fs.statSync(configPath)
      browse(lastVersion())
    } catch (err) {
      console.log('Project must be initiated first, run `ipscend init`')
    }

    function lastVersion () {
      var config = JSON.parse(fs.readFileSync(configPath))
      if (config.versions.length === 0) {
        console.log('You need to publish at least once with <ipscend publish>')
        return
      }
      return config.versions[config.versions.length - 1].hash
    }

    function browse (version) {
      if (!version) {
        return
      }

      var url = 'http://localhost:8080/ipfs/' + version
      open(url)
    }
  }
})

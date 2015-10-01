var Command = require('ronin').Command
var fs = require('fs')
var path = require('path')

module.exports = Command.extend({
  desc: 'Check each version published',

  run: function (name) {
    try {
      var configPath = path.resolve(process.cwd() + '/ipsurge.json')
      fs.statSync(configPath)
      publish()
    } catch (err) {
      console.log('Project must be initiated first, run `ipsurge init`')
    }

    function publish () {
      var config = JSON.parse(fs.readFileSync(configPath))
      config.versions.forEach(function (version) {
        console.log(version.timestamp, version.hash)
      })
    }
  }
})

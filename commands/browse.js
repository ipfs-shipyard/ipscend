var Command = require('ronin').Command
var fs = require('fs')
var path = require('path')
var open = require('open')

module.exports = Command.extend({
  desc: 'Open your application in a browser',

  run: function (name) {
    try {
      var configPath = path.resolve(process.cwd() + '/ipscend.json')
      fs.statSync(configPath)
      browse()
    } catch (err) {
      console.log('Project must be initiated first, run `ipscend init`')
    }

    function browse () {
      var config = JSON.parse(fs.readFileSync(configPath))
      if (config.versions.length === 0) {
        return console.log('You need to publish at least once with <ipscend publish>')
      }
      var url = 'http://localhost:8080/ipfs/' + config.versions[config.versions.length - 1].hash
      open(url)
    }
  }
})

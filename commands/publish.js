var Command = require('ronin').Command
var fs = require('fs')
var ipfsAPI = require('ipfs-api')
var path = require('path')

module.exports = Command.extend({
  desc: 'Publish your project',

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
      // TODO check if daemon is running
      var ipfs = ipfsAPI('localhost', '5001')

      ipfs.add(config.path, { recursive: true }, function (err, res) {
        if (err || !res) {
          return console.error('err', err)
        }

        var version = {
          hash: res[res.length - 1].Hash,
          timestamp: new Date()
        }

        console.log('published', config.path, version.hash)

        config.versions.push(version)

        var fd = fs.openSync(configPath, 'w')
        fs.writeSync(fd, JSON.stringify(config, null, '  '), 0, 'utf-8')
      })
    }
  }
})

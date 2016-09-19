var Command = require('ronin').Command
var fs = require('fs')
var ipfsAPI = require('ipfs-api')
var path = require('path')

module.exports = Command.extend({
  desc: 'Publish your project',

  run: function (name) {
    try {
      var configPath = path.resolve(process.cwd() + '/ipscend.json')
      fs.statSync(configPath)
      publish()
    } catch (err) {
      console.log('Project must be initiated first, run `ipscend init`')
    }

    function publish () {
      var config = JSON.parse(fs.readFileSync(configPath))
      // TODO check if daemon is running
      var ipfs = ipfsAPI('localhost', '5001')

      ipfs.add(config.path, { recursive: true, 'stream-channels': false }, function (err, res) {
        if (err || !res) {
          return console.error('err', err)
        }

        var hash = res[res.length - 1].Hash

        var duplicate = config.versions.filter(function (v) {
          return v.hash === hash
        })[0]

        if (duplicate) {
          console.log('This version (' + duplicate.hash + ') has already been published on:', duplicate.timestamp)
          return
        }

        var version = {
          hash: hash,
          timestamp: new Date()
        }

        console.log('Published', config.path, 'with the following hash:', version.hash)
        console.log('You can access it through your local node or through a public IPFS gateway:')
        console.log('http://localhost:8080/ipfs/' + version.hash)
        console.log('http://ipfs.io/ipfs/' + version.hash)

        config.versions.push(version)

        var fd = fs.openSync(configPath, 'w')
        fs.writeSync(fd, JSON.stringify(config, null, '  '), 0, 'utf-8')
      })
    }
  }
})

'use strict'

const Command = require('ronin').Command
const fs = require('fs')
const ipfsAPI = require('ipfs-api')
const path = require('path')

module.exports = Command.extend({
  desc: 'Publish your project',

  run: function (name) {
    let configPath
    try {
      configPath = path.resolve(process.cwd() + '/ipscend.json')
      fs.statSync(configPath)
      publish()
    } catch (err) {
      console.log('Project must be initiated first, run `ipscend init`')
    }

    function publish () {
      const config = require(configPath)
      const ipfs = ipfsAPI('localhost', '5001')

      ipfs.util.addFromFs(config.path, {
        recursive: true,
        'stream-channels': false
      }, (err, res) => {
        if (err || !res) {
          return console.error('err', err)
        }

        console.log(res)

        const hash = res[res.length - 1].hash

        const duplicate = config.versions.filter(function (v) {
          return v.hash === hash
        })[0]

        if (duplicate) {
          console.log('This version (' + duplicate.hash + ') has already been published on:', duplicate.timestamp)
          return
        }

        const version = {
          hash: hash,
          timestamp: new Date()
        }

        console.log('Published', config.path, 'with the following hash:', version.hash)
        console.log('You can access it through your local node or through a public IPFS gateway:')
        console.log('http://localhost:8080/ipfs/' + version.hash)
        console.log('http://ipfs.io/ipfs/' + version.hash)

        config.versions.push(version)

        const fd = fs.openSync(configPath, 'w')
        fs.writeSync(fd, JSON.stringify(config, null, '  '), 0, 'utf-8')
      })
    }
  }
})

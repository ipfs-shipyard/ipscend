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

      let host = config.provider.host || 'ipfs.infura.io'
      let port = config.provider.port || '5001'
      let opts = config.provider.opts || { protocol:'https' }

      const ipfs = ipfsAPI(host, port, opts)

      ipfs.util.addFromFs(config.path, {
        recursive: true,
        'stream-channels': false
      }, (err, res) => {
        if (err || !res) {
          return console.error('err', err)
        }

        console.log()
        console.log('Uploaded files:')
        console.log(res)
        console.log()
        console.log()
        let hash = ''
        for(let k in res){
          if (res[k].path==config.path) {
            hash = res[k].hash
          }
        }

        const duplicate = config.versions.filter(function (v) {
          return v.hash === hash
        })[0]

        if (duplicate) {
          console.log('This version (' + duplicate.hash + ') has already been published on:', duplicate.timestamp)
          console.log('You can access it by url http://ipfs.io/ipfs/' + duplicate.hash)
          console.log()
          return
        }

        const version = {
          hash: hash,
          timestamp: new Date()
        }

        console.log('Published', config.path, 'with the following hash:', version.hash)
        console.log('You can access it through your local node or through a public IPFS gateway:')

        if (config.provider.host=='localhost') {
          console.log('http://'+config.provider.host+':8080/ipfs/' + version.hash)
        }

        console.log('https://ipfs.io/ipfs/' + version.hash)
        console.log(' OR ')
        console.log('https://ipfs.infura.io/ipfs/' + version.hash)
        console.log()

        config.versions.push(version)

        const fd = fs.openSync(configPath, 'w')
        fs.writeSync(fd, JSON.stringify(config, null, '  '), 0, 'utf-8')
      })
    }
  }
})

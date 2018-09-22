'use strict'

const Command = require('ronin').Command
const fs = require('fs')
const path = require('path')
const webshot = require('webshot')
const ipfsAPI = require('ipfs-api')
const open = require('open')
const Buffer = require('safe-buffer').Buffer

module.exports = Command.extend({
  desc: 'View or generate screenshots for your application',

  options: {
    gen: 'boolean'
  },

  run: (gen, name) => {
    let configPath

    try {
      configPath = path.resolve(process.cwd() + '/ipscend.json')
      fs.statSync(configPath)
      snapshot()
    } catch (err) {
      // console.log(err)
      console.log('Project must be initiated first, run `ipscend init`')
    }

    function snapshot () {
      const config = JSON.parse(fs.readFileSync(configPath))
      if (config.versions.length === 0) {
        return console.log('You need to publish at least once with <ipscend publish>')
      }

      const ipfs = ipfsAPI('localhost', '5001')

      if (!gen) {
        ipfs.add(Buffer.from(JSON.stringify(config.versions)), (err, res) => {
          if (err || !res) {
            return console.error('err', err)
          }
          const previewAppHash = 'QmYH5SM9D2qhJXb6GCQ3AJbqVwecGoAxyjG25j9AskKmdc'
          const versionsHash = res[0].Hash
          const base = 'http://localhost:8080/ipfs/'
          open(base + previewAppHash + '/#' + versionsHash)
        })
        return
      }

      if (gen) {
        let len = config.versions.length
        config.versions.forEach((version) => {
          if (!version.snapshot) {
            webshot('http://localhost:8080/ipfs/' + version.hash,
                '/tmp/' + version.hash + '.png', {
                  shotSize: {
                    width: 'all',
                    height: 'all'
                  }
                }, (err) => {
                  if (err) {
                    return console.log(err)
                  }

                  ipfs.add('/tmp/' + version.hash + '.png', (err, res) => {
                    if (err || !res) {
                      return console.error('err', err)
                    }
                    version.snapshot = res[0].Hash
                    len--
                    if (len === 0) {
                      const fd = fs.openSync(configPath, 'w')
                      fs.writeSync(fd, JSON.stringify(config, null, '  '), 0, 'utf-8')
                    }
                  })
                })
          } else {
            len--
          }
        })
      }
    }
  }
})

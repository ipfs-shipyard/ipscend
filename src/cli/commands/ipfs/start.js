const fs = require('fs')
const ipfsd = require('ipfsd-ctl')
const os = require('os')

var Command = require('ronin').Command
module.exports = Command.extend({
  desc: 'Start your a local IPFS node',
  run: () => {
    const repoPath = process.env.IPFS_PATH || os.homedir() + '/.ipfs'
    var init = false
    try {
      fs.statSync(repoPath)
      // TODO check if it is right repo version, if not, inform the user
      // how to migrate
    } catch (err) {
      init = true
      console.log('no IPFS repo found, going to start a new one')
    }

    ipfsd.disposable({
      repoPath: repoPath,
      init: init,
      apiAddr: '/ip4/127.0.0.1/tcp/5001',
      gatewayAddr: '/ip4/127.0.0.1/tcp/8080'
    }, (err, node) => {
      if (err) {
        return console.log(err)
      }
      console.log('starting IPFS daemon (this might take some seconds)')
      node.startDaemon((err) => {
        if (err) {
          return console.log('failed to start a daemon')
        }
        console.log('IPFS daemon has started, you can now publish with ipscend')
        process.on('SIGINT', () => {
          console.log('Got interrupt signal(SIGINT), shutting down.')
          node.stopDaemon(() => {
            process.exit(0)
          })
        })
      })
    })
  }
})

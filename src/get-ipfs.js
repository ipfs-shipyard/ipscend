'use strict'

const IPFSFactory = require('ipfsd-ctl')

module.exports = (options, callback) => {
  if (options.ipfsDaemon) {
    // TODO
    // do the remote node with ipfs-api, don't start a factory
    // add a fake stop method
  } else {
    const f = IPFSFactory.create({
      // exec: require('ipfs') TODO use js-ipfs node by default
      type: 'js'
    })

    f.spawn({
      // disposable: false
    }, (err, ipfsd) => {
      if (err) { throw err }

      process.on('SIGINT', () => {
        console.log('Got interrupt signal(SIGINT), shutting down the IPFS node')
        ipfsd.stopDaemon(() => process.exit(0))
      })

      callback(null, ipfsd)
    })
  }
}

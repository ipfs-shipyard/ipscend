const { hasDWebFile } = require('./utils.js')
const fs = require('fs')
const getIPFS = require('./get-ipfs.js')
const path = require('path')

module.exports = (yargs) => {
  yargs.command('$0', 'Publish your Website to DWeb with IPFS', (yargs) => { // eslint-disable-line no-unused-expressions
    yargs
      .option('ipfs-daemon', {
        describe: 'Connect and use a running IPFS Daemon (e.g. /ip4/127.0.0.1/tcp/5001)'
      })
      .option('another-option', {
        describe: 'another option',
        default: 9000
      })
  }, (options) => {
    if (!hasDWebFile()) {
      return console.log('No init file found, please run first dweb-publish init')
    }

    const projectConfigPath = path.join(process.cwd(), './.dweb')
    const projectConfig = JSON.parse(fs.readFileSync(projectConfigPath))

    getIPFS(options, (err, ipfsd) => {
      if (err) { throw err }

      ipfsd.api.util.addFromFs(
        path.join(process.cwd(), projectConfig.path),
        { recursive: true },
        (err, files) => {
          if (err) { throw err }

          const cid = files[files.length - 2].hash

          const duplicate = projectConfig.versions.filter((v) => v.hash === cid)[0]

          if (duplicate) {
            console.log('Latest publish (' + duplicate.hash + ') has already been published on:', duplicate.timestamp)
            return
          }

          const version = { cid, timestamp: new Date() }

          console.log('Published', projectConfig.path, 'with the following CID:', version.cid)
          console.log('You can access it through your local node or through a public IPFS gateway:')
          console.log('http://localhost:9090/ipfs/' + version.cid)
          console.log('http://ipfs.io/ipfs/' + version.cid)

          projectConfig.versions.push(version)

          // TODO push to multiple gateways
          const fd = fs.openSync(projectConfigPath, 'w')
          fs.writeSync(fd, JSON.stringify(projectConfig, null, '  '), 0, 'utf-8')
        })
    })
  })
}

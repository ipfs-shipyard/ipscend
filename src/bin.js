#! /usr/bin/env node

'use strict'

const yargs = require('yargs')
const updateNotifier = require('update-notifier')
const readPkgUp = require('read-pkg-up')

const pkg = readPkgUp.sync({cwd: __dirname}).pkg

updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 * 7 // 1 week
}).notify()

const args = process.argv.slice(2)

yargs
  // .epilog(utils.ipfsPathHelp)
  .demandCommand(1)
  .fail((msg, err, yargs) => {
    if (err) {
      throw err // preserve stack
    }

    if (args.length > 0) {
      console.log(msg)
    }

    yargs.showHelp()
  })

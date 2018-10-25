#! /usr/bin/env node

'use strict'

const yargs = require('yargs')
const fs = require('fs')
const updateNotifier = require('update-notifier')
const readPkgUp = require('read-pkg-up')

const pkg = readPkgUp.sync({ cwd: __dirname }).pkg
const week = 1000 * 60 * 60 * 24 * 7 // 1 week

updateNotifier({ pkg, updateCheckInterval: week }).notify()

const args = process.argv.slice(2)

yargs
  .demandCommand(1)
  // .epilog('wowza!') text after all commands
  .fail((msg, err, yargs) => {
    if (err) { throw err } // preserve stack

    if (args.length > 0) {
      console.log(msg)
    }

    yargs.showHelp()
  })

fs.readdirSync(__dirname)
  .filter((name) => !name.indexOf('command-'))
  .forEach((command) => require('./' + command)(yargs))

yargs.argv // eslint-disable-line no-unused-expressions

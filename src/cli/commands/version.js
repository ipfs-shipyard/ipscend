'use strict'

const Command = require('ronin').Command

module.exports = Command.extend({
  desc: 'ipscend version',

  options: {
  },

  run: () => {
    const pkg = require('../../../package.json')
    console.log('Version: ', pkg.version)
  }
})

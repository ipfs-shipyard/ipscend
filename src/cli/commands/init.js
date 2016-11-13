'use strict'

var Command = require('ronin').Command
var fs = require('fs')
var ask = require('asking').ask

module.exports = Command.extend({
  desc: 'Initialize a ipscend project',

  run: function (name) {
    try {
      fs.statSync(process.cwd() + '/ipscend.json')
      console.log('ipscend was already initiated on this repo')
    } catch (err) {
      bootstrap()
    }

    function bootstrap () {
      var config = {
        versions: []
      }
      console.log('This utility will walk you through creating a ipscend.json file.')
      ask('Path of your Web Application (project)?', { default: 'public' }, function (err, path) {
        if (err) {
          return console.log(err) // TODO Handle this err properly
        }
        config['path'] = path
        var fd = fs.openSync(process.cwd() + '/ipscend.json', 'w')
        fs.writeSync(fd, JSON.stringify(config, null, '  '), 0, 'utf-8')
      })
    }
  }
})

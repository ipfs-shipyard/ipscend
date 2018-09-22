'use strict'

var Command = require('ronin').Command
var fs = require('fs')
var path = require('path')
var open = require('open')
var ns = require('node-static')
var http = require('http')

module.exports = Command.extend({
  desc: 'Preview your application before you publish it',

  options: {
    port: {
      type: 'string',
      alias: 'p'
    }
  },

  run: function (port, name) {
    var configPath
    try {
      configPath = path.resolve(process.cwd() + '/ipscend.json')
      fs.statSync(configPath)
      preview()
    } catch (err) {
      console.log(err)
      console.log('Project must be initiated first, run `ipscend init`')
    }

    function preview () {
      var config = JSON.parse(fs.readFileSync(configPath))

      var file = new ns.Server(config.path)

      http.createServer(function (request, response) {
        request.addListener('end', function () {
          file.serve(request, response)
        }).resume()
      }).listen(parseInt(port, 10) || 8000, function () {
        open('http://localhost:' + (parseInt(port, 10) || 8000))
      })
    }
  }
})

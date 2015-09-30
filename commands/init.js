var Command = require('ronin').Command

var AppsAddCommand = module.exports = Command.extend({
  desc: 'This command adds application',

  run: function (name) {
    console.log('woo', name)
  }
})

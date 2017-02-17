const UTTT = require('ultimate-ttt');
const tripwire = require('tripwire');

const funcs = require('./funcs');

function onlineGame(options) {
  const host = 'localhost';
  const port = options.port || 3141;
  console.log('Server started on: http://' + host + ':' + port);
}

module.exports = onlineGame;
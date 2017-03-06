
/**
 * Ultimate Tic Tac Toe Algorithm Battle - Game Server
 */

const localGame = require('./lib/local');
const onlineGame = require('./lib/online');

function server(options) {
  if (options.local) {
    localGame(options);
  } else if (options.a || options.b) {
    console.error('Error: Player files may only be specified for local games (use --local with -a and -b)');
  } else {
    onlineGame(options);
  }
}

module.exports = server;
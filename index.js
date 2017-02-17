/**
 * Ultimate Tic Tac Toe Algorithm Battle - Game Server
 */

const localGame = require('./lib/local');

function server(options) {
  console.info("+-----------------------------------+");
  console.info("|   Ultimate TTT Algorithm Battle   |");
  console.info("+-----------------------------------+");

  if (options.local) {
    localGame(options);
  } else if (options.a || options.b) {
    console.error('Error: Player files may only be specified for local games (use --local with -a and -b)');
    return;
  }
}

module.exports = server;
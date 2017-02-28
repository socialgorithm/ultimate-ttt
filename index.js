const blessed = require('blessed');

/**
 * Ultimate Tic Tac Toe Algorithm Battle - Game Server
 */

const localGame = require('./lib/local');
const onlineGame = require('./lib/online');

function server(options) {
  const screen = blessed.screen({
    dump: __dirname + '/layout.log',
    smartCSR: true,
    warnings: true
  });

  screen.title = 'Ultimate TTT Algorithm Battle';

  const header = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: 3,
    align: 'center',
    tags: true,
    content: '{bold}{red-fg}Ultimate TTT Algorithm Battle{/red-fg}{/bold}',
  });

  screen.key(['escape', 'q', 'C-c'], function() {
    return process.exit(0);
  });

  if (options.local) {
    localGame(options);
  } else if (options.a || options.b) {
    console.error('Error: Player files may only be specified for local games (use --local with -a and -b)');
    return;
  }

  onlineGame(options, screen, header);
}

module.exports = server;
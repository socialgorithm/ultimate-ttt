const UTTT = require('ultimate-ttt');
const ip = require('ip');
const blessed = require('blessed');

const funcs = require('./funcs');
const State = require('./state');

const serverInfo = {
  players: [],
  games: [],
  nextGame: 0,
  ui: {},
};

/**
 * Start an online game server - supports multiple games at once
 * It's also the module export of this file
 * @param options
 */
function onlineGame(options, screen, header) {
  const host = 'localhost';
  const port = options.port || 3141;

  const app = require('http').createServer(handler);
  const io = require('socket.io')(app);
  const fs = require('fs');

  app.listen(port);

  header.insertBottom('{yellow-fg}Local address:{/yellow-fg}   http://' + host + ':' + port);
  header.insertBottom('{yellow-fg}Network address:{/yellow-fg} http://' + ip.address() + ':' + port);

  serverInfo.ui.screen = screen;

  serverInfo.ui.onlineUsers = blessed.box({
    parent: screen,
    top: 4,
    left: 0,
    width: 20,
    height: '100%-4',
    tags: true,
    content: '{bold}Online users{/bold}',
    border: 'line',
    style: {
      border: {
        fg: 'blue',
      }
    }
  });

  serverInfo.ui.gameArea = blessed.box({
    parent: screen,
    top: 4,
    left: 21,
    width: '100%-22',
    height: '100%-14',
    content: '{bold}Games{/bold}',
    tags: true,
    border: 'line',
    style: {
      border: {
        fg: 'blue',
      }
    }
  });

  serverInfo.ui.logger = blessed.log({
    parent: screen,
    bottom: 0,
    left: 21,
    width: '100%-22',
    height: 10,
    border: 'line',
    tags: true,
    keys: true,
    vi: true,
    mouse: true,
    scrollback: 100,
    scrollbar: {
      ch: ' ',
      track: {
        bg: 'yellow'
      },
      style: {
        inverse: true
      }
    },
    style: {
      border: {
        fg: 'blue',
      }
    }
  });

  log('Server started', true);

  function handler (req, res) {
    fs.readFile(__dirname + '/../public/index.html',
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
      });
  }

  io.set('authorization', function (data, accept) {
    const token = data._query.token;
    if (!token) {
      return accept('Missing token', false);
    }
    data.testToken = token;
    accept(null, true);
  });

  io.on('connection', function (socket) {

    const playerIndex = addPlayer(socket.handshake.query.token);

    if (!serverInfo.games[serverInfo.nextGame]) {
      serverInfo.games[serverInfo.nextGame] = {
        players: []
      };
    } else if (serverInfo.games[serverInfo.nextGame].players.length >= 2) {
      serverInfo.nextGame++;
      serverInfo.games[serverInfo.nextGame] = {
        players: []
      };
    }

    const session = serverInfo.games[serverInfo.nextGame];
    const player = session.players.length;
    session.players[player] = {
      playerIndex: playerIndex,
      socket: socket
    };

    if (session.players.length >= 2) {
      startSession(session, options);
      serverInfo.nextGame++;
    }

    socket.emit('game', {
      action: 'waiting'
    });
  });

  screen.render();
}

function log(text, skipRender) {
  const time = (new Date()).toTimeString().substr(0,5);
  serverInfo.ui.logger.log('{blue-fg}[' + time + ']{/blue-fg} ' + text);
  if (!skipRender) {
    serverInfo.ui.screen.render();
  }
}

function addPlayer(player) {
  let index = -1;
  if (serverInfo.players.indexOf(player) < 0) {
    index = serverInfo.players.push(player) - 1;
  }
  log('Connected "' + player + '"', true);
  renderOnlinePlayers();
  return index;
}

function removePlayer(player) {
  const index = serverInfo.players.indexOf(player);
  if (index > -1) {
    serverInfo.players.splice(index, 1);
  }
  log('Disconnected "' + player + '"', true);
  renderOnlinePlayers();
}

function renderOnlinePlayers() {
  serverInfo.ui.onlineUsers.content = '{bold}Online players{/bold}';
  serverInfo.ui.onlineUsers.render();
  serverInfo.players.forEach(function(player) {
    serverInfo.ui.onlineUsers.insertBottom(' ' + player);
  });

  serverInfo.ui.screen.render();
}

/**
 * Take a game holder with two connected players and start
 * playing
 * @param session Game session with two active players ready
 */
function startSession(session, settings){
  const options = settings || {};

  log('Starting games between "' +
    serverInfo.players[session.players[0].playerIndex] +
    '" and "' +
    serverInfo.players[session.players[1].playerIndex] +
    '"'
  );

  const server = {
    timeout: options.timeout || 100,
    maxGames: options.games || 1000,
    state: new State(),
    session: session,
    currentPlayer: 0,
    firstPlayer: 0,
    game: new UTTT(),
    gameStart: null,
    ui: getGameBox(),
    progressBar: null,
  };

  server.ui.append(blessed.text({
    top: 0,
    left: 0,
    style: {
      bg: 'black'
    },
    tags: true,
    content: '{red-fg}"' +
      serverInfo.players[session.players[0].playerIndex] +
    '"{/red-fg} vs {red-fg}"' +
    serverInfo.players[session.players[1].playerIndex] +
    '"{/red-fg}'
  }));

  server.progressBar = getProgressBar();
  server.ui.append(server.progressBar);
  server.ui.render();

  serverInfo.ui.gameArea.render();
  serverInfo.ui.screen.render();

  session.players[0].socket.on('disconnect', function() {
    removePlayer(serverInfo.players[session.players[0].playerIndex]);
    handleGameEnd(1, true);
  });
  session.players[1].socket.on('disconnect', function() {
    removePlayer(serverInfo.players[session.players[1].playerIndex]);
    handleGameEnd(0, true);
  });

  // Receive input from a player
  session.players[0].socket.on('game', handlePlayerMove(0));
  session.players[1].socket.on('game', handlePlayerMove(1));

  // Start game session
  playGame();

  function handleGameEnd(winner, playerDisconnected) {
    const hrend = process.hrtime(server.gameStart);
    server.state.times.push(funcs.convertExecTime(hrend[1]));
    if (winner > -1) {
      server.state.wins[winner]++;
      server.firstPlayer = winner;
    } else {
      server.firstPlayer = 1 - server.firstPlayer;
      server.state.ties++;
    }

    const progress = Math.floor(server.state.games * 100 / server.maxGames);
    server.progressBar.setProgress(progress);
    serverInfo.ui.screen.render();

    if (!playerDisconnected && server.state.games < server.maxGames) {
      playGame(server.session, server.firstPlayer);
    } else {
      sessionEnd();
    }
  }

  /**
   * Handle the end of a session between two players
   */
  function sessionEnd() {
    const players = [
      serverInfo.players[session.players[0].playerIndex],
      serverInfo.players[session.players[1].playerIndex],
    ];
    log('Finished games between "' +
      players[0] +
      '" and "' +
      players[1]  +
      '"'
    );

    server.progressBar.destroy();
    serverInfo.ui.screen.render();

    const stats = funcs.getStats(server.state);
    let winner = '-';
    if (stats.winner > -1){
      winner = players[stats.winner];
    }

    server.ui.append(blessed.text({
      top: 1,
      left: 0,
      style: {
        bg: 'black'
      },
      tags: true,
      content: '{blue-fg}Winner:{/blue-fg} ' + winner +
        '. {blue-fg}Wins:{/blue-fg} {yellow-fg}Player "' + players[0] + '"{/yellow-fg} ' + server.state.wins[0] + ' (' + stats.winPercentages[0] + '%) - ' +
        '{yellow-fg}Player "' + players[1] + '"{/yellow-fg} ' + server.state.wins[1] + ' (' + stats.winPercentages[1] + '%) - ' +
        '{blue-fg}Ties{/blue-fg} ' + server.state.ties + ' (' + stats.tiePercentage + '%)'
    }));

    server.ui.append(blessed.text({
      top: 2,
      left: 0,
      style: {
        bg: 'black'
      },
      tags: true,
      content: '{yellow-fg}Total time:{/yellow-fg} ' + stats.total + 'ms. ' +
              '{yellow-fg}Avg:{/yellow-fg} ' + stats.avg + 'ms. ' +
              '{yellow-fg}Max:{/yellow-fg} ' + stats.max + 'ms. ' +
              '{yellow-fg}Min:{/yellow-fg} ' + stats.min + 'ms'
    }));


    // All done
    //funcs.printState(server.state);
  }

  /**
   * Play an individual game between two players
   */
  function playGame() {
    server.gameStart = process.hrtime();
    server.state.games++;
    server.game = new UTTT();
    server.currentPlayer = server.firstPlayer;
    server.game.init();

    sendAction(server.session, 'init', 0);
    sendAction(server.session, 'init', 1);

    sendAction(server.session, 'move', server.firstPlayer);
  }

  /**
   * Handles a specific player move - this returns a function
   * configured for the specified player, it's intended to be used
   * as the callback for the player socket.
   * @param player Player number (0-1)
   * @returns {Function}
   */
  function handlePlayerMove(player) {
    return function(data) {
      if (server.currentPlayer !== player) {
        log('Game ' + server.state.games + ': Player ' + player + ' played out of time (it was ' + server.currentPlayer + ' turn)');
        handleGameEnd(server.currentPlayer);
        return;
      }
      if (data === 'fail') {
        handleGameEnd(1 - server.currentPlayer);
        return;
      }
      try {
        const coords = parseMove(data);
        server.game.move(coords.board, server.currentPlayer + 1, coords.move);
        if (server.game.isFinished()) {
          handleGameEnd(server.game.winner - 1);
          return;
        }
        server.currentPlayer = 1 - server.currentPlayer;
        sendAction(session, 'opponent ' + writeMove(coords), server.currentPlayer);
      } catch(e) {
        log('Game ' + server.state.games + ': Player ' + server.currentPlayer + ' errored: ' + e.message);
        handleGameEnd(1 - server.currentPlayer);
      }
    };
  }
}

function getGameBox() {
  const height = 3;
  return blessed.box({
    parent: serverInfo.ui.gameArea,
    top: 2 + (serverInfo.games.length - 1) * height,
    left: 0,
    width: '100%-2',
    height: height,
    tags: true,
    style: {
      bg: 'black'
    }
  });
}

function getProgressBar() {
  return blessed.progressbar({
    top: 2,
    left: 0,
    orientation: 'horizontal',
    keys: false,
    mouse: false,
    filled: 0,
    style: {
      bg: 'black',
      bar: {
        bg: 'blue'
      },
      border: {
        bg: 'black'
      }
    },
    width: '100%',
    height: 1,
  });
}

/**
 * Send an action to a player
 * @param session Session object
 * @param action Action to send
 * @param player Player number (0-1)
 */
function sendAction(session, action, player) {
  if (session.players[player]) {
    session.players[player].socket.emit('game', {
      action: action
    });
  }
}

/**
 * Receive a move from a player and convert it to an object
 * of board and move
 * @param data String received from the client
 * @returns {{board: Array, move: Array}}
 */
function parseMove(data) {
  const parts = data.trim().split(';');
  return {
    board: parts[0].split(',').map(function(coord) { return parseInt(coord, 10); }),
    move: parts[1].split(',').map(function(coord) { return parseInt(coord, 10); })
  };
}

/**
 * Encode a move received from a player to be sent to the opponent
 * @param coords {{board: Array, move: Array}}
 * @returns {string}
 */
function writeMove(coords) {
  return coords.board[0] + ',' + coords.board[1] + ';' +
      coords.move[0] + ',' + coords.move[1];
}

module.exports = onlineGame;
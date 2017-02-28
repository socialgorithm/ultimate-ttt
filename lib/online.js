const UTTT = require('ultimate-ttt');

const funcs = require('./funcs');
const State = require('./state');

function onlineGame(options) {
  const host = 'localhost';
  const port = options.port || 3141;

  const app = require('http').createServer(handler);
  const io = require('socket.io')(app);
  const fs = require('fs');

  app.listen(port);

  console.log('Server started on: http://' + host + ':' + port);

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
    console.log('Authenticated:', token);
    data.testToken = token;
    accept(null, true);
  });

  const sessions = [];
  let nextGame = 0;

  io.on('connection', function (socket) {

    console.log('Connected token:', socket.handshake.query.token);
    console.log('Connected to session:', nextGame);

    if (!sessions[nextGame]) {
      sessions[nextGame] = {
        players: []
      };
    } else if (sessions[nextGame].players.length >= 2) {
      nextGame++;
      sessions[nextGame] = {
        players: []
      };
    }

    const session = sessions[nextGame];
    const player = session.players.length;
    session.players[player] = socket;

    if (session.players.length >= 2) {
      startSession(session, options);
      nextGame++;
    }

    socket.emit('game', {
      action: 'waiting'
    });
  });
}

/**
 * Take a game holder with two connected players and start
 * playing
 * @param session Game session with two active players ready
 */
function startSession(session, settings){
  const options = settings || {};

  const server = {
    timeout: options.timeout || 100,
    maxGames: options.games || 1000,
    state: new State(),
    session: session,
    currentPlayer: 0,
    firstPlayer: 0,
    game: new UTTT(),
    gameStart: null
  };

  session.players[0].on('disconnect', function() {
    console.log('Player 0 disconnected');
    handleGameEnd(1, true);
  });
  session.players[1].on('disconnect', function() {
    console.log('Player 1 disconnected');
    handleGameEnd(0, true);
  });

  // Receive input from a player
  session.players[0].on('game', handlePlayerMove(0));
  session.players[1].on('game', handlePlayerMove(1));

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

    if (!playerDisconnected && server.state.games < server.maxGames) {
      playGame(server.session, server.firstPlayer);
    } else {
      sessionEnd();
    }
  }

  function sessionEnd() {
    // All done
    funcs.printState(server.state);

    console.log('Player 1: ' + session.players[0].handshake.query.token);
    console.log('Player 2: ' + session.players[1].handshake.query.token);
  }

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

  function handlePlayerMove(player) {
    return function(data) {
      if (server.currentPlayer !== player) {
        console.log('Game ' + server.state.games + ': Player ' + player + ' played out of time (it was ' + server.currentPlayer + ' turn)');
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
        console.error('Game ' + server.state.games + ': Player ' + server.currentPlayer + ' errored');
        handleGameEnd(1 - server.currentPlayer);
      }
    };
  }
}

function sendAction(session, action, player) {
  if (session.players[player]) {
    session.players[player].emit('game', {
      action: action
    });
  }
}

function parseMove(data) {
  const parts = data.trim().split(';');
  return {
    board: parts[0].split(',').map(function(coord) { return parseInt(coord, 10); }),
    move: parts[1].split(',').map(function(coord) { return parseInt(coord, 10); })
  };
}

function writeMove(coords) {
  return coords.board[0] + ',' + coords.board[1] + ';' +
      coords.move[0] + ',' + coords.move[1];
}

module.exports = onlineGame;
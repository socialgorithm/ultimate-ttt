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

    console.log('Connected token: ', socket.handshake.query.token);
    console.log('Game', nextGame);

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
      startSession(session);
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

  // const timeout = options.timeout || 100;
  // const games = options.games || 1000;
  const state = new State();

  // let gameStart = process.hrtime();
  let currentPlayer = 0;
  state.games++;

  playGame(session, currentPlayer, function(winner) {
    if (winner > -1) {
      state.wins[winner]++;
    } else {
      state.ties++;
    }

    funcs.printState(state);
  });
}

function playGame(session, firstPlayer, callback) {
  const game = new UTTT();
  let currentPlayer = firstPlayer;
  game.init();

  sendAction(session, 'init', 0);
  sendAction(session, 'init', 1);

  sendAction(session, 'move', currentPlayer);

  function handleEvent(session, data){
    try {
      const coords = parseMove(data);
      game.move(coords.board, currentPlayer + 1, coords.move);
      if (game.isFinished()) {
        callback(game.winner);
      }
      currentPlayer = 1 - currentPlayer;
      sendAction(session, 'opponent ' + writeMove(coords), currentPlayer);
    } catch(e) {
      console.error('Player ' + currentPlayer + ' errored', e);
      callback(1 - currentPlayer);
    }
  }

  session.players[0].on('disconnect', function() {
    console.log('Player 0 disconnected');
    callback(1);
  });
  session.players[1].on('disconnect', function() {
    console.log('Player 1 disconnected');
    callback(0);
  });

  // Receive input from a player
  session.players[0].on('game', function(data) {
    console.log('player 0> ' + data);
    if (currentPlayer !== 0) {
      console.log('Player 0 played out of time (it was ' + currentPlayer + ' turn)');
      callback(1);
      return;
    }
    handleEvent(session, data);
  });
  session.players[1].on('game', function(data) {
    console.log('player 1> ' + data);
    if (currentPlayer !== 1) {
      console.log('Player 1 played out of time (it was ' + currentPlayer + ' turn)');
      callback(0);
      return;
    }
    handleEvent(session, data);
  });
}

function sendAction(session, action, player) {
  console.log('server to player ' + player + '> ' + action);
  session.players[player].emit('game', {
    action: action
  });
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
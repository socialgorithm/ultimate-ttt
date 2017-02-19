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
  session.players[0].on('disconnect', function() {
    console.log('Player 0 disconnected');
  });
  session.players[1].on('disconnect', function() {
    console.log('Player 1 disconnected');
  });

  session.players[0].on('game', function(data) {
    console.log('Player 0:', data);
  });
  session.players[1].on('game', function(data) {
    console.log('Player 1:', data);
  });

  const timeout = options.timeout || 100;
  const games = options.games || 1000;
  const state = new State();

  let gameStart = process.hrtime();
  let game = new UTTT();
  state.games++;
  let currentPlayer = 0;

  session.players[0].emit('game', {
    action: 'init'
  });
  session.players[1].emit('game', {
    action: 'init'
  });

  session.players[currentPlayer].emit('game', {
    action: 'move'
  });
}

module.exports = onlineGame;
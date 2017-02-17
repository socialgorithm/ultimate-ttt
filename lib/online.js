const UTTT = require('ultimate-ttt');
const tripwire = require('tripwire');

const funcs = require('./funcs');

function onlineGame(options) {
  const host = 'localhost';
  const port = options.port || 3141;

  const app = require('http').createServer(handler);
  const io = require('socket.io')(app);
  const fs = require('fs');

  app.listen(port);

  console.log('Server started on: http://' + host + ':' + port);

  function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
      });
  }

  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
}

module.exports = onlineGame;
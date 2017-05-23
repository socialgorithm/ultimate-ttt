"use strict";
exports.__esModule = true;
var http = require("http");
var io = require("socket.io");
var fs = require("fs");
var GUI_1 = require("./GUI");
var OnlineGame_1 = require("./OnlineGame");
var pjson = require('../../package.json');
var OnlineServer = (function () {
    function OnlineServer(options) {
        var _this = this;
        this.players = [];
        this.games = [];
        this.nextGame = 0;
        this.host = options.host;
        this.port = parseInt(options.port, 10) || 3141;
        var app = http.createServer(this.handler);
        this.io = io(app);
        app.listen(this.port);
        var title = 'Ultimate TTT Algorithm Battle v' + pjson.version;
        if (options.gui) {
            this.ui = new GUI_1["default"](title, this.host, this.port);
        }
        else {
            this.log(title);
            this.log('Listening on ' + this.host + ':' + this.port);
        }
        this.log('Server started', true);
        this.io.use(function (socket, next) {
            var isClient = socket.request._query.client || false;
            if (isClient) {
                return next();
            }
            var token = socket.request._query.token;
            if (!token) {
                return next(new Error('Missing token'));
            }
            socket.request.testToken = token;
            next();
        });
        this.io.on('connection', function (socket) {
            if (socket.handshake.query.client) {
                socket.emit('stats', {
                    type: 'stats',
                    payload: {
                        players: _this.players,
                        games: []
                    }
                });
                return true;
            }
            var playerIndex = _this.addPlayer(socket.handshake.query.token);
            if (!_this.games[_this.nextGame]) {
                _this.games[_this.nextGame] = {
                    players: []
                };
            }
            else if (_this.games[_this.nextGame].players.length >= 2) {
                _this.nextGame++;
                _this.games[_this.nextGame] = {
                    players: []
                };
            }
            var session = _this.games[_this.nextGame];
            var player = session.players.length;
            session.players[player] = {
                playerIndex: playerIndex,
                socket: socket
            };
            if (session.players.length >= 2) {
                _this.startSession(session, options);
                _this.nextGame++;
            }
            socket.emit('game', {
                action: 'waiting'
            });
        });
        if (this.ui) {
            this.ui.render();
        }
    }
    OnlineServer.prototype.startSession = function (session, settings) {
        if (settings === void 0) { settings = {}; }
        this.log('Starting games between "' +
            this.players[session.players[0].playerIndex] +
            '" and "' +
            this.players[session.players[1].playerIndex] +
            '"');
        this.io.emit('stats', {
            type: 'session-start',
            payload: {
                players: [
                    this.players[session.players[0].playerIndex],
                    this.players[session.players[1].playerIndex]
                ]
            }
        });
        var onlineGame = new OnlineGame_1["default"](session, this.io, this.players, this.ui, settings);
        session.players[0].socket.on('disconnect', function () {
            if (session.players && session.players[0]) {
                this.removePlayer(this.players[session.players[0].playerIndex]);
            }
            onlineGame.handleGameEnd(1, true);
        });
        session.players[1].socket.on('disconnect', function () {
            if (session.players && session.players[1]) {
                this.removePlayer(this.players[session.players[1].playerIndex]);
            }
            onlineGame.handleGameEnd(0, true);
        });
        session.players[0].socket.on('game', onlineGame.handlePlayerMove(0));
        session.players[1].socket.on('game', onlineGame.handlePlayerMove(1));
        onlineGame.playGame();
    };
    OnlineServer.prototype.handler = function (req, res) {
        fs.readFile(__dirname + '/../../public/index.html', function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        });
    };
    OnlineServer.prototype.addPlayer = function (player) {
        var index = -1;
        if (this.players.indexOf(player) < 0) {
            index = this.players.push(player) - 1;
        }
        this.log('Connected "' + player + '"', true);
        this.io.emit('stats', {
            type: 'connect',
            payload: player
        });
        if (this.ui) {
            this.ui.renderOnlinePlayers(this.players);
        }
        return index;
    };
    OnlineServer.prototype.removePlayer = function (player) {
        var index = this.players.indexOf(player);
        if (index > -1) {
            this.players.splice(index, 1);
        }
        this.log('Disconnected "' + player + '"', true);
        this.io.emit('stats', {
            type: 'disconnect',
            payload: player
        });
        if (this.ui) {
            this.ui.renderOnlinePlayers(this.players);
        }
    };
    OnlineServer.prototype.log = function (message, skipRender) {
        if (skipRender === void 0) { skipRender = false; }
        var time = (new Date()).toTimeString().substr(0, 5);
        if (this.ui) {
            this.ui.log(message, skipRender);
        }
        else {
            console.log(time, message);
        }
    };
    return OnlineServer;
}());
exports["default"] = OnlineServer;
//# sourceMappingURL=OnlineServer.js.map
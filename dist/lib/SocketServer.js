"use strict";
exports.__esModule = true;
var http = require("http");
var io = require("socket.io");
var fs = require("fs");
var Player_1 = require("./Player");
var SocketServerImpl = (function () {
    function SocketServerImpl(port, socketEvents) {
        var _this = this;
        var app = http.createServer(this.handler);
        this.io = io(app);
        app.listen(port);
        this.socketEvents = socketEvents;
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
            var player = new Player_1.PlayerImpl(socket.handshake.query.token, socket);
            socket.on('lobby create', function () {
                var lobby = _this.socketEvents.onLobbyCreate(player);
                socket.on('lobby tournament start', function () {
                    console.log('start tournament');
                    var tournament = _this.socketEvents.onLobbyTournamentStart(lobby.token);
                    if (tournament == null) {
                        socket.emit('exception', { error: 'Unable to start tournament' });
                    }
                    else {
                        _this.io["in"](lobby.token).emit('started tournament', {
                            lobby: lobby.toObject(),
                            tournament: tournament
                        });
                    }
                });
                if (lobby == null) {
                    socket.emit('exception', { error: 'Unable to create lobby' });
                }
                else {
                    socket.join(lobby.token);
                    socket.emit('lobby created', {
                        lobby: lobby.toObject()
                    });
                }
            });
            socket.on('lobby join', function (data) {
                var lobby = _this.socketEvents.onLobbyJoin(player, data.token, data.spectating);
                if (lobby == null) {
                    socket.emit('lobby exception', { error: 'Unable to join lobby, ensure token is correct' });
                    return;
                }
                _this.io["in"](data.token).emit('connected', {
                    lobby: lobby.toObject()
                });
                socket.join(lobby.token);
                socket.emit('lobby joined', {
                    lobby: lobby.toObject(),
                    isAdmin: lobby.admin.token === player.token
                });
            });
            socket.on('disconnect', function () {
                _this.socketEvents.onPlayerDisconnect(player);
            });
            _this.socketEvents.onPlayerConnect(player);
        });
    }
    SocketServerImpl.prototype.emit = function (type, data) {
        this.io.emit(type, data);
    };
    SocketServerImpl.prototype.emitInLobby = function (lobby, type, data) {
        this.io.to(lobby).emit(type, data);
    };
    SocketServerImpl.prototype.emitPayload = function (emitType, type, payload) {
        this.emit(emitType, { type: type, payload: payload });
    };
    SocketServerImpl.prototype.handler = function (req, res) {
        fs.readFile(__dirname + '/../../public/index.html', function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        });
    };
    return SocketServerImpl;
}());
exports.SocketServerImpl = SocketServerImpl;
//# sourceMappingURL=SocketServer.js.map
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var http = require("http");
var io = require("socket.io");
var fs = require("fs");
var events = require("../events");
var Player_1 = require("../tournament/model/Player");
var Subscriber_1 = require("../tournament/model/Subscriber");
var SocketServer = (function (_super) {
    __extends(SocketServer, _super);
    function SocketServer(port) {
        var _this = _super.call(this) || this;
        var app = http.createServer(_this.handler);
        _this.io = io(app);
        app.listen(port);
        _this.io.use(function (socket, next) {
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
        _this.io.on('connection', function (socket) {
            var token = socket.handshake.query.token;
            var player = new Player_1["default"](token);
            _this.playerSockets[token] = socket;
            socket.on('lobby create', _this.publishPlayerEvent(events.LOBBY_CREATE, token));
            socket.on('lobby tournament start', _this.publishPlayerEvent(events.TOURNAMENT_START, token));
            socket.on('lobby join', _this.publishPlayerEvent(events.LOBBY_JOIN, token));
            socket.on('game', function (data) {
                _this.publishNamespaced(token, events.PLAYER_DATA, data);
            });
            socket.on('disconnect', function (data) {
                delete _this.playerSockets[token];
                _this.publishPlayerEvent(events.PLAYER_DISCONNECT, token)(data);
            });
            _this.publish(events.PLAYER_CONNECT, player);
        });
        _this.subscribe(events.success(events.LOBBY_JOIN), _this.onLobbyJoined);
        _this.subscribe(events.success(events.PLAYER_DISCONNECT), _this.onPlayerDisconnected);
        return _this;
    }
    SocketServer.prototype.onLobbyJoined = function (data) {
        this.io["in"](data.lobby.token).emit('connected', {
            lobby: data.lobby.toObject()
        });
        var socket = this.playerSockets[data.player.token];
        if (!socket) {
            console.error('Unknown player', data.player.token);
            return;
        }
        socket.join(data.lobby.token);
        socket.emit('lobby joined', {
            lobby: data.lobby.toObject(),
            isAdmin: data.lobby.admin.token === data.player.token
        });
    };
    SocketServer.prototype.publishPlayerEvent = function (event, token) {
        var _this = this;
        return function (data) {
            _this.publish(event + "." + token, data);
        };
    };
    SocketServer.prototype.emitInLobby = function (lobby, type, data) {
        this.io.to(lobby).emit(type, data);
    };
    SocketServer.prototype.emitPayload = function (emitType, data) {
        this.io.emit(emitType, data);
    };
    SocketServer.prototype.emitToPlayer = function (playerToken, type, data) {
        var socket = this.playerSockets[data.player.token];
        if (!socket) {
            console.error('Unknown player', data.player.token);
            return;
        }
        socket.emit(type, data);
    };
    SocketServer.prototype.onPlayerDisconnected = function (data) {
        var _this = this;
        data.lobbyList.forEach(function (lobby) {
            _this.emitInLobby(lobby.token, 'lobby disconnected', {
                lobby: lobby.toObject()
            });
        });
    };
    SocketServer.prototype.handler = function (req, res) {
        fs.readFile(__dirname + '/../../public/index.html', function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        });
    };
    return SocketServer;
}(Subscriber_1["default"]));
exports["default"] = SocketServer;
//# sourceMappingURL=SocketServer.js.map
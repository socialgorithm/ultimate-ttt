"use strict";
exports.__esModule = true;
var fs = require("fs");
var http = require("http");
var io = require("socket.io");
var Channel_1 = require("tournament/model/Channel");
var Player_1 = require("tournament/model/Player");
var constants_1 = require("./constants");
var SocketServer = (function () {
    function SocketServer(port, socketEvents) {
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
                return next(new Error("Missing token"));
            }
            socket.request.testToken = token;
            next();
        });
        this.io.on("connection", function (socket) {
            var playerChannel = new Channel_1["default"](socket);
            var player = new Player_1["default"](socket.handshake.query.token, playerChannel);
            socket.on("lobby create", function () {
                var lobby = _this.socketEvents.onLobbyCreate(player);
                if (lobby == null) {
                    socket.emit("exception", { error: "Unable to create lobby" });
                }
                else {
                    socket.join(lobby.token);
                    socket.emit("lobby created", {
                        lobby: lobby.toObject()
                    });
                }
            });
            socket.on("lobby tournament start", function (data) {
                var token = data.token;
                var options = Object.assign(constants_1.DEFAULT_TOURNAMENT_OPTIONS, data.options);
                var players = data.players;
                var lobby = _this.socketEvents.onLobbyTournamentStart(token, options, players);
                if (lobby == null) {
                    socket.emit("exception", { error: "Unable to start tournament" });
                }
                else {
                    _this.io["in"](lobby.token).emit("lobby tournament started", {
                        lobby: lobby.toObject()
                    });
                }
            });
            socket.on("lobby tournament continue", function (data) {
                var token = data.lobbyToken;
                var lobby = _this.socketEvents.onLobbyTournamentContinue(token);
                if (lobby == null) {
                    socket.emit("exception", { error: "Unable to continue tournament" });
                }
                else {
                    _this.io["in"](lobby.token).emit("lobby tournament continued", {
                        lobby: lobby.toObject()
                    });
                }
            });
            socket.on("lobby join", function (data) {
                var lobby = _this.socketEvents.onLobbyJoin(player, data.token, data.spectating);
                if (lobby == null) {
                    socket.emit("lobby exception", { error: "Unable to join lobby, ensure token is correct" });
                    return;
                }
                _this.io["in"](data.token).emit("connected", {
                    lobby: lobby.toObject()
                });
                socket.join(lobby.token);
                socket.emit("lobby joined", {
                    isAdmin: lobby.admin.token === player.token,
                    lobby: lobby.toObject()
                });
            });
            socket.on("lobby player kick", function (data) {
                var lobbyToken = data.lobbyToken, playerToken = data.playerToken;
                var lobby = _this.socketEvents.onLobbyKick(lobbyToken, playerToken);
                if (lobby == null) {
                    socket.emit("exception", { error: "Unable to kick player" });
                }
                else {
                    _this.io["in"](lobby.token).emit("lobby player kicked", {
                        lobby: lobby.toObject()
                    });
                    _this.io["in"](playerToken).emit("kicked");
                }
            });
            socket.on("lobby player ban", function (data) {
                var lobbyToken = data.lobbyToken, playerToken = data.playerToken;
                var lobby = _this.socketEvents.onLobbyBan(lobbyToken, playerToken);
                if (lobby == null) {
                    socket.emit("exception", { error: "Unable to ban player" });
                }
                else {
                    _this.io["in"](lobby.token).emit("lobby player banned", {
                        lobby: lobby.toObject()
                    });
                    _this.io["in"](playerToken).emit("banned");
                }
            });
            socket.on("disconnect", function () {
                _this.socketEvents.onPlayerDisconnect(player);
            });
            _this.socketEvents.onPlayerConnect(player);
        });
    }
    SocketServer.prototype.emit = function (type, data) {
        this.io.emit(type, data);
    };
    SocketServer.prototype.emitInLobby = function (lobby, type, data) {
        this.io.to(lobby).emit(type, data);
    };
    SocketServer.prototype.emitPayload = function (emitType, type, payload) {
        this.emit(emitType, { type: type, payload: payload });
    };
    SocketServer.prototype.handler = function (req, res) {
        fs.readFile(__dirname + "/../../public/index.html", function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end("Error loading index.html");
            }
            res.writeHead(200);
            res.end(data);
        });
    };
    return SocketServer;
}());
exports["default"] = SocketServer;
//# sourceMappingURL=SocketServer.js.map
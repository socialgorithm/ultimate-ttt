"use strict";
exports.__esModule = true;
var Lobby_1 = require("../tournament/model/Lobby");
var Tournament_1 = require("../tournament/Tournament");
var SocketServer_1 = require("./SocketServer");
var pjson = require("../../package.json");
var Server = (function () {
    function Server(options) {
        var _this = this;
        this.options = options;
        this.onPlayerDisconnect = function (player) {
            _this.log("Handle player disconnect on his active games");
            _this.lobbies.forEach(function (lobby) {
                var playerIndex = lobby.players.findIndex(function (eachPlayer) { return eachPlayer.token === player.token; });
                if (playerIndex < 0) {
                    return;
                }
                lobby.players.splice(playerIndex, 1);
                _this.socketServer.emitToLobbyInfo(lobby.token, "lobby disconnected", {
                    payload: {
                        lobby: lobby.toObject()
                    },
                    type: "player left"
                });
            });
        };
        this.onLobbyKick = function (lobbyToken, playerToken) {
            _this.log("Player " + playerToken + " is being kicked from " + lobbyToken);
            var foundLobby = _this.lobbies.find(function (l) { return l.token === lobbyToken; });
            if (foundLobby == null) {
                _this.log("Lobby not found (" + lobbyToken + ")");
                return null;
            }
            var playerIndex = foundLobby.players.findIndex(function (p) { return p.token === playerToken; });
            foundLobby.players.splice(playerIndex, 1);
            return foundLobby;
        };
        this.onLobbyBan = function (lobbyToken, playerToken) {
            _this.log("Player " + playerToken + " is being banned from " + lobbyToken);
            var foundLobby = _this.lobbies.find(function (l) { return l.token === lobbyToken; });
            if (foundLobby == null) {
                _this.log("Lobby not found (" + lobbyToken + ")");
                return null;
            }
            var playerIndex = foundLobby.players.findIndex(function (p) { return p.token === playerToken; });
            foundLobby.players.splice(playerIndex, 1);
            foundLobby.bannedPlayers.push(playerToken);
            return foundLobby;
        };
        this.onLobbyCreate = function (creator) {
            var lobby = new Lobby_1.Lobby(creator);
            _this.lobbies.push(lobby);
            _this.log("Created lobby " + lobby.token);
            return lobby;
        };
        this.onLobbyJoin = function (player, lobbyToken, spectating) {
            if (spectating === void 0) { spectating = false; }
            _this.log("Player " + player.token + " wants to join " + lobbyToken + " - spectating? " + spectating);
            var foundLobby = _this.lobbies.find(function (l) { return l.token === lobbyToken; });
            if (foundLobby == null) {
                _this.log("Lobby not found (" + lobbyToken + ")");
                return null;
            }
            if (foundLobby.bannedPlayers.find(function (p) { return p === player.token; })) {
                return null;
            }
            if (!spectating && foundLobby.players.find(function (p) { return p.token === player.token; }) == null) {
                foundLobby.players.push(player);
                _this.log("Player " + player.token + " joined " + lobbyToken);
            }
            return foundLobby;
        };
        this.players = [];
        this.lobbies = [];
        this.socketServer = new SocketServer_1["default"](this.options.port, {
            onLobbyBan: this.onLobbyBan.bind(this),
            onLobbyCreate: this.onLobbyCreate.bind(this),
            onLobbyJoin: this.onLobbyJoin.bind(this),
            onLobbyKick: this.onLobbyKick.bind(this),
            onLobbyTournamentContinue: this.onLobbyTournamentContinue.bind(this),
            onLobbyTournamentStart: this.onLobbyTournamentStart.bind(this),
            onPlayerConnect: this.onPlayerConnect.bind(this),
            onPlayerDisconnect: this.onPlayerDisconnect.bind(this),
            updateStats: this.updateStats.bind(this)
        });
        var title = "Ultimate TTT Algorithm Battle v" + pjson.version;
        this.log(title);
        this.log("Listening on localhost:" + this.options.port);
        this.log("Server started");
    }
    Server.prototype.onPlayerConnect = function (player) {
        this.addPlayer(player);
        player.channel.send("waiting");
    };
    Server.prototype.onLobbyTournamentStart = function (lobbyToken, tournamentOptions, players) {
        var foundLobby = this.lobbies.find(function (l) { return l.token === lobbyToken; });
        if (foundLobby == null) {
            return null;
        }
        if (foundLobby.tournament == null || foundLobby.tournament.isFinished()) {
            this.log("Starting tournament in lobby " + foundLobby.token + "!");
            var playersToPlay = foundLobby.players.filter(function (p) { return players.includes(p.token); });
            foundLobby.tournament = new Tournament_1.Tournament(tournamentOptions, this.socketServer, playersToPlay, foundLobby.token);
            foundLobby.tournament.start();
        }
        return foundLobby;
    };
    Server.prototype.onLobbyTournamentContinue = function (lobbyToken) {
        var foundLobby = this.lobbies.find(function (l) { return l.token === lobbyToken; });
        if (foundLobby == null) {
            return null;
        }
        if (foundLobby.tournament == null || foundLobby.tournament.isFinished()) {
            return null;
        }
        foundLobby.tournament["continue"]();
        return foundLobby;
    };
    Server.prototype.updateStats = function () {
        var payload = { players: this.players.map(function (p) { return p.token; }), games: [] };
        this.socketServer.emitPayload("stats", "stats", payload);
    };
    Server.prototype.addPlayer = function (player) {
        var _this = this;
        var matches = this.players.filter(function (p) { return p.token === player.token; });
        if (matches.length > 0) {
            matches[0].channel.disconnect();
            this.removePlayer(matches[0]);
        }
        process.nextTick(function () {
            if (_this.players.filter(function (p) { return p.token === player.token; }).length === 0) {
                _this.players.push(player);
            }
            _this.log("Connected \"" + player.token + "\"");
            _this.socketServer.emitPayload("stats", "connect", player.token);
        });
    };
    Server.prototype.removePlayer = function (player) {
        var index = this.players.indexOf(player);
        if (index > -1) {
            this.players.splice(index, 1);
        }
        else {
            return;
        }
        this.log("Disconnected " + player.token);
        this.socketServer.emitPayload("stats", "disconnect", player.token);
    };
    Server.prototype.log = function (message) {
        var time = (new Date()).toTimeString().substr(0, 5);
        console.log("[" + time + "]", message);
    };
    return Server;
}());
exports["default"] = Server;
//# sourceMappingURL=Server.js.map
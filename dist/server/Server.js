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
var GUI_1 = require("./GUI");
var SocketServer_1 = require("./SocketServer");
var Tournament_1 = require("../tournament/Tournament");
var Lobby_1 = require("../tournament/model/Lobby");
var events = require("../events");
var Subscriber_1 = require("../tournament/model/Subscriber");
var pjson = require('../../package.json');
var Server = (function (_super) {
    __extends(Server, _super);
    function Server(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.onPlayerDisconnect = function (player) {
            _this.log('Handle player disconnect on his active games');
            var lobbyList = [];
            _this.lobbies.forEach(function (lobby) {
                var playerIndex = lobby.players.findIndex(function (eachPlayer) { return eachPlayer.token === player.token; });
                if (playerIndex < 0) {
                    return;
                }
                lobby.players.splice(playerIndex, 1);
                lobbyList.push(lobby);
            });
            _this.publish(events.success(events.PLAYER_DISCONNECT), {
                lobbyList: lobbyList,
                player: player
            });
        };
        _this.onLobbyCreate = function (creator) {
            var lobby = new Lobby_1.Lobby(creator);
            _this.lobbies.push(lobby);
            _this.log('Created lobby ' + lobby.token);
            return lobby;
        };
        _this.onLobbyJoin = function (player, lobbyToken, spectating) {
            if (spectating === void 0) { spectating = false; }
            _this.log('Player ' + player.token + ' wants to join ' + lobbyToken + ' - spectating? ' + spectating);
            var foundLobby = _this.lobbies.find(function (l) { return l.token === lobbyToken; });
            if (foundLobby == null) {
                _this.log('Lobby not found (' + lobbyToken + ')');
                return null;
            }
            if (!spectating && foundLobby.players.find(function (p) { return p.token === player.token; }) == null) {
                foundLobby.players.push(player);
                _this.log('Player ' + player.token + ' joined ' + lobbyToken);
            }
            _this.publish(events.success(events.LOBBY_JOIN), {
                lobby: foundLobby,
                player: player
            });
            return foundLobby;
        };
        _this.players = [];
        _this.lobbies = [];
        _this.socketServer = new SocketServer_1["default"](_this.options.port);
        var title = "Ultimate TTT Algorithm Battle v" + pjson.version;
        if (options.gui) {
            _this.ui = new GUI_1["default"](title, _this.options.port);
        }
        else {
            _this.log(title);
            _this.log("Listening on localhost:" + _this.options.port);
        }
        _this.log('Server started', true);
        if (_this.ui) {
            _this.ui.render();
        }
        _this.subscribe(events.PLAYER_CONNECT, _this.onPlayerConnect);
        _this.subscribe(events.PLAYER_DISCONNECT, _this.onPlayerDisconnect);
        _this.subscribe(events.LOBBY_CREATE, _this.onLobbyCreate);
        _this.subscribe(events.LOBBY_JOIN, _this.onLobbyJoin);
        _this.subscribe(events.TOURNAMENT_START, _this.onLobbyTournamentStart);
        _this.subscribe(events.LOG, _this.log);
        return _this;
    }
    Server.prototype.onPlayerConnect = function (player) {
        if (this.players.filter(function (p) { return p.token === player.token; }).length === 0) {
            this.players.push(player);
        }
        this.log("Connected \"" + player.token + "\"", true);
    };
    Server.prototype.onLobbyTournamentStart = function (lobbyToken, tournamentOptions) {
        var foundLobby = this.lobbies.find(function (l) { return l.token === lobbyToken; });
        if (foundLobby == null) {
            return null;
        }
        if (foundLobby.tournament == null || foundLobby.tournament.isFinished()) {
            this.log("Starting tournament in lobby " + foundLobby.token + "!");
            foundLobby.tournament = new Tournament_1.Tournament(tournamentOptions, this.socketServer, foundLobby.players, foundLobby.token);
            foundLobby.tournament.start();
        }
        return foundLobby.tournament;
    };
    Server.prototype.removePlayer = function (player) {
        var index = this.players.indexOf(player);
        if (index > -1) {
            this.players.splice(index, 1);
        }
        else {
            return;
        }
        this.log("Disconnected " + player.token, true);
        if (this.ui) {
            this.ui.renderOnlinePlayers(this.players.map(function (p) { return p.token; }));
        }
    };
    Server.prototype.log = function (message, skipRender) {
        if (skipRender === void 0) { skipRender = false; }
        var time = (new Date()).toTimeString().substr(0, 5);
        if (this.ui) {
            this.ui.log(message, skipRender);
        }
        else {
            console.log("[" + time + "]", message);
        }
    };
    return Server;
}(Subscriber_1["default"]));
exports["default"] = Server;
//# sourceMappingURL=Server.js.map
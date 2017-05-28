"use strict";
exports.__esModule = true;
var GUI_1 = require("./GUI");
var OnlineGame_1 = require("./OnlineGame");
var SocketServer_1 = require("./SocketServer");
var Session_1 = require("./Session");
var pjson = require('../../package.json');
var OnlineServer = (function () {
    function OnlineServer(options) {
        var _this = this;
        this.options = options;
        this.players = [];
        this.games = [];
        this.nextGame = 0;
        this.socketServer = new SocketServer_1.SocketServerImpl(this.options.port, {
            onPlayerConnect: function (player) { return _this.onPlayerConnect(player); },
            onPlayerDisconnect: function (player) { return _this.onPlayerDisconnect(player); },
            updateStats: function () { return _this.updateStats(); },
            onTournamentStart: function () { return _this.onTournamentStart(); }
        });
        var title = "Ultimate TTT Algorithm Battle v" + pjson.version;
        if (options.gui) {
            this.ui = new GUI_1["default"](title, this.options.host, this.options.port);
        }
        else {
            this.log(title);
            this.log("Listening on " + this.options.host + ":" + this.options.port);
        }
        this.log('Server started', true);
        if (this.ui) {
            this.ui.render();
        }
    }
    OnlineServer.prototype.onTournamentStart = function () {
    };
    OnlineServer.prototype.onPlayerConnect = function (player) {
        var playerIndex = this.addPlayer(player);
        var session = this.games[this.nextGame];
        if (!this.games[this.nextGame]) {
            this.games[this.nextGame] = new Session_1["default"]([undefined, undefined]);
        }
        else if (session.players[0] !== undefined && session.players[1] !== undefined) {
            this.nextGame++;
            this.games[this.nextGame] = new Session_1["default"]([undefined, undefined]);
        }
        session = this.games[this.nextGame];
        session.players[session.players[0] === undefined ? 0 : 1] = player;
        if (session.players[0] !== undefined && session.players[1] !== undefined) {
            this.startSession(session, this.options);
            this.nextGame++;
        }
        player.deliverAction('waiting');
    };
    OnlineServer.prototype.onPlayerDisconnect = function (player) {
        console.log('handle player disconnect on his active games');
    };
    OnlineServer.prototype.updateStats = function () {
        var payload = { players: this.players.map(function (p) { return p.token; }), games: [] };
        this.socketServer.emitPayload('stats', 'stats', payload);
    };
    OnlineServer.prototype.startSession = function (session, settings) {
        var _this = this;
        if (settings === void 0) { settings = {}; }
        this.log("Starting games between \"" + session.players[0].token + "\" and \"" + session.players[1].token + "\"");
        this.socketServer.emitPayload('stats', 'session-start', { players: session.playerTokens() });
        var onlineGame = new OnlineGame_1["default"](session, this.socketServer, this.ui, settings);
        session.players.forEach(function (player) {
            player.session = session;
            player.socket.on('disconnect', function () {
                _this.removePlayer(player);
                onlineGame.handleGameEnd(player.otherPlayerInSession(), true);
            });
            player.socket.on('game', onlineGame.handlePlayerMove(player));
        });
        onlineGame.playGame();
    };
    OnlineServer.prototype.addPlayer = function (player) {
        var index = -1;
        if (this.players.indexOf(player) < 0) {
            index = this.players.push(player) - 1;
        }
        this.log("Connected \"" + player.token + "\"", true);
        this.socketServer.emitPayload('stats', 'connect', player.token);
        if (this.ui) {
            this.ui.renderOnlinePlayers(this.players.map(function (p) { return p.token; }));
        }
        return index;
    };
    OnlineServer.prototype.removePlayer = function (player) {
        var index = this.players.indexOf(player);
        if (index > -1) {
            this.players.splice(index, 1);
        }
        this.log("Disconnected " + player.token, true);
        this.socketServer.emitPayload('stats', 'disconnect', player.token);
        if (this.ui) {
            this.ui.renderOnlinePlayers(this.players.map(function (p) { return p.token; }));
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
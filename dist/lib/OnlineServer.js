"use strict";
exports.__esModule = true;
var GUI_1 = require("./GUI");
var SocketServer_1 = require("./SocketServer");
var Tournament_1 = require("./Tournament");
var pjson = require('../../package.json');
var OnlineServer = (function () {
    function OnlineServer(options) {
        var _this = this;
        this.options = options;
        this.players = [];
        this.socketServer = new SocketServer_1.SocketServerImpl(this.options.port, {
            onPlayerConnect: function (player) { return _this.onPlayerConnect(player); },
            onPlayerDisconnect: function (player) { return _this.onPlayerDisconnect(player); },
            updateStats: function () { return _this.updateStats(); },
            onTournamentStart: function () { return _this.onTournamentStart(); }
        });
        var title = "Ultimate TTT Algorithm Battle v" + pjson.version;
        if (options.gui) {
            this.ui = new GUI_1["default"](title, this.options.port);
        }
        else {
            this.log(title);
            this.log("Listening on localhost:" + this.options.port);
        }
        this.log('Server started', true);
        if (this.ui) {
            this.ui.render();
        }
    }
    OnlineServer.prototype.onTournamentStart = function () {
        if (this.tournament === undefined || this.tournament.isFinished()) {
            console.log('Starting tournament');
            this.tournament = new Tournament_1.Tournament('Tournament', this.socketServer, this.players.slice(), this.ui);
            this.tournament.start();
        }
    };
    OnlineServer.prototype.onPlayerConnect = function (player) {
        this.addPlayer(player);
        player.deliverAction('waiting');
    };
    OnlineServer.prototype.onPlayerDisconnect = function (player) {
        console.log('handle player disconnect on his active games');
    };
    OnlineServer.prototype.updateStats = function () {
        var payload = { players: this.players.map(function (p) { return p.token; }), games: [] };
        this.socketServer.emitPayload('stats', 'stats', payload);
    };
    OnlineServer.prototype.addPlayer = function (player) {
        var _this = this;
        var matches = this.players.filter(function (p) { return p.token === player.token; });
        if (matches.length > 0) {
            matches[0].socket.disconnect();
            this.removePlayer(matches[0]);
        }
        process.nextTick(function () {
            if (_this.players.filter(function (p) { return p.token === player.token; }).length === 0) {
                _this.players.push(player);
            }
            _this.log("Connected \"" + player.token + "\"", true);
            _this.socketServer.emitPayload('stats', 'connect', player.token);
            if (_this.ui) {
                _this.ui.renderOnlinePlayers(_this.players.map(function (p) { return p.token; }));
            }
        });
    };
    OnlineServer.prototype.removePlayer = function (player) {
        var index = this.players.indexOf(player);
        if (index > -1) {
            this.players.splice(index, 1);
        }
        else {
            return;
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
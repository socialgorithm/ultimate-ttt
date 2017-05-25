"use strict";
exports.__esModule = true;
var ultimate_ttt_1 = require("@socialgorithm/ultimate-ttt");
var State_1 = require("./State");
var funcs = require("./funcs");
var OnlineGame = (function () {
    function OnlineGame(session, socket, ui, options) {
        this.session = session;
        this.socket = socket;
        this.ui = ui;
        this.state = new State_1["default"]();
        this.timeout = parseInt(options.timeout, 10) || 100;
        this.maxGames = parseInt(options.games, 10) || 1000;
        this.currentPlayer = this.playerZero();
        this.firstPlayer = this.playerZero();
        this.game = new ultimate_ttt_1["default"]();
        if (this.ui) {
            this.gameIDForUI = this.ui.addGameBox.apply(this.ui, this.session.playerTokens());
        }
    }
    OnlineGame.prototype.playGame = function () {
        this.gameStart = process.hrtime();
        this.state.games++;
        this.game = new ultimate_ttt_1["default"]();
        this.currentPlayer = this.firstPlayer;
        this.socket.emitPayload('stats', 'game-start', { players: this.session.playerTokens() });
        this.playerZero().deliverAction('init');
        this.playerOne().deliverAction('init');
        this.firstPlayer.deliverAction('move');
    };
    OnlineGame.prototype.handleGameEnd = function (winner, playerDisconnected) {
        if (playerDisconnected === void 0) { playerDisconnected = false; }
        var hrend = process.hrtime(this.gameStart);
        this.state.times.push(funcs.convertExecTime(hrend[1]));
        if (winner !== undefined && winner !== null) {
            this.state.wins[winner.getIndexInSession()]++;
        }
        else {
            this.state.ties++;
        }
        this.firstPlayer = this.session.players[this.firstPlayer.getIndexInSession() === 1 ? 0 : 1];
        if (this.ui) {
            var progress = Math.floor(this.state.games * 100 / this.maxGames);
            this.ui.setGameProgress(this.gameIDForUI, progress);
        }
        if (!playerDisconnected && this.state.games < this.maxGames) {
            this.playGame();
        }
        else {
            this.sessionEnd();
        }
    };
    OnlineGame.prototype.parseMove = function (data) {
        var _a = data.trim().split(';')
            .map(function (part) { return part.split(',').map(function (n) { return parseInt(n); }); }), board = _a[0], move = _a[1];
        return { board: board, move: move };
    };
    OnlineGame.prototype.writeMove = function (coords) {
        var board = coords.board, move = coords.move;
        return [board, move].map(function (p) { return p.join(','); }).join(';');
    };
    OnlineGame.prototype.handlePlayerMove = function (player) {
        var _this = this;
        var i = 0;
        return function (data) {
            if (_this.currentPlayer !== player) {
                _this.log("Game " + _this.state.games + ": Player " + player.token + " played out of time (it was " + _this.currentPlayer.token + "'s turn)");
                _this.handleGameEnd(_this.currentPlayer);
                return;
            }
            if (data === 'fail') {
                _this.handleGameEnd(_this.switchPlayer(_this.currentPlayer));
                return;
            }
            try {
                var coords = _this.parseMove(data);
                _this.game.move(coords.board, _this.currentPlayer.getIndexInSession(), coords.move);
                if (_this.game.isFinished()) {
                    _this.handleGameEnd(_this.switchPlayer(_this.session.players[_this.game.winner]));
                    return;
                }
                _this.currentPlayer = _this.switchPlayer(_this.currentPlayer);
                _this.currentPlayer.deliverAction("opponent " + _this.writeMove(coords));
            }
            catch (e) {
                _this.log("Game " + _this.state.games + ": Player " + _this.currentPlayer.token + " errored: " + e.message);
                _this.handleGameEnd(_this.switchPlayer(_this.currentPlayer));
            }
        };
    };
    OnlineGame.prototype.switchPlayer = function (player) {
        return this.session.players[this.session.players.indexOf(player) === 0 ? 1 : 0];
    };
    OnlineGame.prototype.sessionEnd = function () {
        this.log("Finished games between \"" + this.playerZero().token + "\" and \"" + this.playerOne().token + "\"");
        var stats = this.state.getStats();
        if (stats.winner === -1) {
            this.session.players.forEach(function (p) { return p.deliverAction('end tie'); });
        }
        else {
            this.session.players[stats.winner].deliverAction('end win');
            this.session.players[1 - stats.winner].deliverAction('end lose');
        }
        this.socket.emitPayload('stats', 'session-end', { players: this.session.playerTokens(), stats: stats });
        var winner = undefined;
        if (stats.winner > -1) {
            winner = this.session.players[stats.winner];
        }
        if (this.ui) {
            this.ui.setGameEnd(this.gameIDForUI, winner.token, this.state);
        }
        else {
            this.log("Session ended between " + this.playerZero().token + " and " + this.playerOne().token + "; " + (winner ? winner.token + " won" : 'the players tied'));
        }
    };
    OnlineGame.prototype.playerZero = function () {
        return this.session.players[0];
    };
    OnlineGame.prototype.playerOne = function () {
        return this.session.players[1];
    };
    OnlineGame.prototype.log = function (message, skipRender) {
        if (skipRender === void 0) { skipRender = false; }
        var time = (new Date()).toTimeString().substr(0, 5);
        if (this.ui) {
            this.ui.log(message, skipRender);
        }
        else {
            console.log(time, message);
        }
    };
    return OnlineGame;
}());
exports["default"] = OnlineGame;
//# sourceMappingURL=OnlineGame.js.map
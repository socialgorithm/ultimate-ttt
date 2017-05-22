"use strict";
exports.__esModule = true;
var ultimate_ttt_1 = require("ultimate-ttt");
var State_1 = require("./State");
var funcs = require("./funcs");
var OnlineGame = (function () {
    function OnlineGame(session, io, players, ui, options) {
        this.ui = ui;
        this.io = io;
        this.session = session;
        this.state = new State_1["default"]();
        this.timeout = parseInt(options.timeout, 10) || 100;
        this.maxGames = parseInt(options.games, 10) || 1000;
        this.players = players;
        this.currentPlayer = 0;
        this.firstPlayer = 0;
        this.game = new ultimate_ttt_1["default"]();
        if (this.ui) {
            this.gameUIId = this.ui.addGameBox(this.players[session.players[0].playerIndex], this.players[session.players[0].playerIndex]);
        }
    }
    OnlineGame.prototype.playGame = function () {
        this.gameStart = process.hrtime();
        this.state.games++;
        this.game = new ultimate_ttt_1["default"]();
        this.currentPlayer = this.firstPlayer;
        this.io.emit('stats', {
            type: 'game-start',
            payload: {
                players: [
                    this.players[this.session.players[0].playerIndex],
                    this.players[this.session.players[1].playerIndex]
                ]
            }
        });
        this.sendAction('init', 0);
        this.sendAction('init', 1);
        this.sendAction('move', this.firstPlayer);
    };
    OnlineGame.prototype.handleGameEnd = function (winner, playerDisconnected) {
        var hrend = process.hrtime(this.gameStart);
        this.state.times.push(funcs.convertExecTime(hrend[1]));
        if (winner > -1) {
            this.state.wins[winner]++;
        }
        else {
            this.state.ties++;
        }
        this.firstPlayer = 1 - this.firstPlayer;
        if (this.ui) {
            var progress = Math.floor(this.state.games * 100 / this.maxGames);
            this.ui.setGameProgress(this.gameUIId, progress);
        }
        if (!playerDisconnected && this.state.games < this.maxGames) {
            this.playGame();
        }
        else {
            this.sessionEnd();
        }
    };
    OnlineGame.prototype.parseMove = function (data) {
        var parts = data.trim().split(';');
        var board = parts[0].split(',').map(function (coord) { return parseInt(coord, 10); });
        var move = parts[1].split(',').map(function (coord) { return parseInt(coord, 10); });
        return {
            board: [
                board[0],
                board[1],
            ],
            move: [
                move[0],
                move[1],
            ]
        };
    };
    OnlineGame.prototype.writeMove = function (coords) {
        return coords.board[0] + ',' + coords.board[1] + ';' +
            coords.move[0] + ',' + coords.move[1];
    };
    OnlineGame.prototype.handlePlayerMove = function (player) {
        var _this = this;
        return function (data) {
            if (_this.currentPlayer !== player) {
                _this.log('Game ' + _this.state.games +
                    ': Player ' + player + ' played out of time (it was ' + _this.currentPlayer + ' turn)');
                _this.handleGameEnd(_this.currentPlayer);
                return;
            }
            if (data === 'fail') {
                _this.handleGameEnd(1 - _this.currentPlayer);
                return;
            }
            try {
                var coords = _this.parseMove(data);
                _this.game.move(coords.board, _this.currentPlayer + 1, coords.move);
                if (_this.game.isFinished()) {
                    _this.handleGameEnd(_this.game.winner - 1);
                    return;
                }
                _this.currentPlayer = 1 - _this.currentPlayer;
                _this.sendAction('opponent ' + _this.writeMove(coords), _this.currentPlayer);
            }
            catch (e) {
                _this.log('Game ' + _this.state.games + ': Player ' + _this.currentPlayer + ' errored: ' + e.message);
                _this.handleGameEnd(1 - _this.currentPlayer);
            }
        };
    };
    OnlineGame.prototype.sendAction = function (action, player) {
        if (this.session.players[player]) {
            this.session.players[player].socket.emit('game', {
                action: action
            });
        }
    };
    OnlineGame.prototype.sessionEnd = function () {
        var players = [
            this.players[this.session.players[0].playerIndex],
            this.players[this.session.players[1].playerIndex],
        ];
        this.log('Finished games between "' +
            players[0] +
            '" and "' +
            players[1] +
            '"');
        var stats = this.state.getStats();
        if (stats.winner === -1) {
            this.sendAction('end tie', 0);
            this.sendAction('end tie', 1);
        }
        else if (stats.winner === 0) {
            this.sendAction('end win', 0);
            this.sendAction('end lose', 1);
        }
        else {
            this.sendAction('end lose', 0);
            this.sendAction('end win', 1);
        }
        this.io.emit('stats', {
            type: 'session-end',
            payload: {
                players: [
                    this.players[this.session.players[0].playerIndex],
                    this.players[this.session.players[1].playerIndex]
                ],
                stats: stats
            }
        });
        var winner = '-';
        if (stats.winner > -1) {
            winner = players[stats.winner];
        }
        if (this.ui) {
            this.ui.setGameEnd(this.gameUIId, winner, this.state);
        }
        else {
            this.log('Session ended between ' + players[0] + ' and ' + players[1] + '. Winner ' + winner);
        }
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
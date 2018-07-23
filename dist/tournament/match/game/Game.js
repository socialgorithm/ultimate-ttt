"use strict";
exports.__esModule = true;
var UTTT_1 = require("@socialgorithm/ultimate-ttt/dist/UTTT");
var State_1 = require("../../model/State");
var funcs = require("../../../lib/funcs");
var Game = (function () {
    function Game(players, options, events, log) {
        var _this = this;
        this.players = players;
        this.options = options;
        this.events = events;
        this.log = log;
        this.game = new UTTT_1["default"]();
        this.state = new State_1["default"]();
        this.gamePromise = new Promise(function (resolve) {
            _this.resolve = resolve;
        });
    }
    Game.prototype.playGame = function () {
        this.gameStart = process.hrtime();
        this.currentPlayerIndex = 0;
        this.playerZero().channel.registerHandler('game', this.handlePlayerMove(this.playerZero(), 0));
        this.playerOne().channel.registerHandler('game', this.handlePlayerMove(this.playerOne(), 1));
        this.playerZero().channel.send('game', 'init');
        this.playerOne().channel.send('game', 'init');
        this.players[this.currentPlayerIndex].channel.send('game', 'move');
        return this.gamePromise;
    };
    Game.prototype.handlePlayerMove = function (player, playerIndex) {
        var _this = this;
        return function (data) {
            if (_this.currentPlayerIndex !== playerIndex) {
                _this.log("Game " + _this.state.games + ": Player " + player.token + " played out of turn (it was " + _this.players[_this.currentPlayerIndex].token + "'s turn)");
                _this.handleGameWon(_this.currentPlayerIndex);
                return;
            }
            if (data === 'fail') {
                _this.handleGameWon(_this.switchPlayer(_this.currentPlayerIndex));
                return;
            }
            try {
                var coords = _this.parseMove(data);
                _this.game = _this.game.move(_this.currentPlayerIndex, coords.board, coords.move);
                _this.currentPlayerIndex = _this.switchPlayer(_this.currentPlayerIndex);
                _this.players[_this.currentPlayerIndex].channel.send('game', "opponent " + _this.writeMove(coords));
                if (_this.game.isFinished()) {
                    if (_this.game.winner === -1) {
                        _this.handleGameTied();
                    }
                    else {
                        _this.handleGameWon(_this.game.winner);
                    }
                    return;
                }
            }
            catch (e) {
                _this.handleGameWon(_this.switchPlayer(_this.currentPlayerIndex));
            }
        };
    };
    Game.prototype.handleGameWon = function (winnerIndex) {
        this.handleGameEnd();
        this.winnerIndex = winnerIndex;
    };
    Game.prototype.handleGameTied = function () {
        this.handleGameEnd();
        this.winnerIndex = -1;
    };
    Game.prototype.handleGameEnd = function () {
        var _this = this;
        var hrend = process.hrtime(this.gameStart);
        this.state.times.push(funcs.convertExecTime(hrend[1]));
        this.players.forEach(function (player, index) {
            var gameState = 'tied';
            if (_this.winnerIndex > -1) {
                if (_this.winnerIndex === index) {
                    gameState = 'won';
                }
                else {
                    gameState = 'lost';
                }
            }
            player.channel.send('game', "end " + gameState);
            player.channel.removeAllHandlers();
        });
        console.log('--------------- GAME ENDED ----------------');
        this.resolve(true);
    };
    Game.prototype.parseMove = function (data) {
        var _a = data.trim().split(';')
            .map(function (part) { return part.split(',').map(function (n) { return parseInt(n); }); }), board = _a[0], move = _a[1];
        return { board: board, move: move };
    };
    Game.prototype.writeMove = function (coords) {
        var board = coords.board, move = coords.move;
        return [board, move].map(function (p) { return p.join(','); }).join(';');
    };
    Game.prototype.switchPlayer = function (playerNumber) {
        return playerNumber === 0 ? 1 : 0;
    };
    Game.prototype.playerZero = function () {
        return this.players[0];
    };
    Game.prototype.playerOne = function () {
        return this.players[1];
    };
    return Game;
}());
exports["default"] = Game;
//# sourceMappingURL=Game.js.map
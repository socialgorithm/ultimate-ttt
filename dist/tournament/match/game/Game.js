"use strict";
exports.__esModule = true;
var UTTT_1 = require("@socialgorithm/ultimate-ttt/dist/UTTT");
var constants_1 = require("@socialgorithm/ultimate-ttt/dist/model/constants");
var funcs = require("../../../lib/funcs");
var AFTER_TIMEOUT_DELAY = 100;
var Game = (function () {
    function Game(players, options, log) {
        var _this = this;
        this.players = players;
        this.options = options;
        this.log = log;
        this.game = new UTTT_1["default"]();
        this.gamePromise = new Promise(function (resolve) {
            _this.resolve = resolve;
        });
        this.winnerIndex = null;
        this.timedoutPlayer = null;
    }
    Game.prototype.playGame = function () {
        this.gameStart = process.hrtime();
        this.currentPlayerIndex = 0;
        this.players[0].channel.registerHandler('game', this.handlePlayerMove(0));
        this.players[1].channel.registerHandler('game', this.handlePlayerMove(1));
        this.resetPlayers();
        this.askForMove();
        return this.gamePromise;
    };
    Game.prototype.getStats = function () {
        return { moves: this.moves, uttt: this.game };
    };
    Game.prototype.resetPlayers = function () {
        this.players[0].channel.send('game', 'init');
        this.players[1].channel.send('game', 'init');
    };
    Game.prototype.askForMove = function (move) {
        var _this = this;
        if (move) {
            this.players[this.currentPlayerIndex].channel.send('game', "opponent " + move);
        }
        else {
            this.players[this.currentPlayerIndex].channel.send('game', 'move');
        }
        this.playerMoveTimeout = setTimeout(function () {
            _this.handlePlayerTimeout(_this.currentPlayerIndex);
        }, this.options.timeout);
    };
    Game.prototype.handlePlayerMove = function (playerIndex) {
        var _this = this;
        return function (data) {
            if (_this.timedoutPlayer !== null || _this.winnerIndex !== null) {
                return;
            }
            try {
                if (_this.currentPlayerIndex !== playerIndex) {
                    var player = _this.players[playerIndex];
                    _this.log("Game " + _this.options.gameId + ": Player " + player.token + " played out of turn (it was " + _this.players[_this.currentPlayerIndex].token + "'s turn)");
                    _this.handleGameWon(_this.currentPlayerIndex);
                    return;
                }
                clearTimeout(_this.playerMoveTimeout);
                if (data === 'fail') {
                    _this.handleGameWon(_this.switchPlayer(_this.currentPlayerIndex));
                    return;
                }
                var coords = _this.parseMove(data);
                _this.game = _this.game.move(_this.currentPlayerIndex, coords.board, coords.move);
                _this.moves.push({
                    board: coords.board,
                    move: coords.move,
                    player: _this.currentPlayerIndex
                });
                _this.currentPlayerIndex = _this.switchPlayer(_this.currentPlayerIndex);
                _this.askForMove(_this.writeMove(coords));
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
                _this.log("Game " + _this.options.gameId + ": Player " + _this.players[_this.currentPlayerIndex].token + " errored: " + e.message);
                _this.handleGameWon(_this.switchPlayer(_this.currentPlayerIndex));
            }
        };
    };
    Game.prototype.handlePlayerTimeout = function (playerIndex) {
        this.timedoutPlayer = playerIndex;
        this.log("Game " + this.options.gameId + ": Player " + this.players[playerIndex].token + " timed out");
        this.handleGameWon(this.switchPlayer(playerIndex), AFTER_TIMEOUT_DELAY);
    };
    Game.prototype.handleGameWon = function (winnerIndex, delay) {
        if (this.winnerIndex !== null) {
            return;
        }
        this.winnerIndex = winnerIndex;
        this.handleGameEnd(delay);
    };
    Game.prototype.handleGameTied = function () {
        if (this.winnerIndex !== null) {
            return;
        }
        this.winnerIndex = constants_1.RESULT_TIE;
        this.handleGameEnd();
    };
    Game.prototype.handleGameEnd = function (delay) {
        var _this = this;
        clearTimeout(this.playerMoveTimeout);
        var hrend = process.hrtime(this.gameStart);
        this.gameTime = funcs.convertExecTime(hrend[1]);
        this.players.forEach(function (player, index) {
            var gameState = 'tied';
            if (_this.winnerIndex > constants_1.RESULT_TIE) {
                if (_this.winnerIndex === index) {
                    gameState = 'won';
                }
                else {
                    gameState = 'lost';
                }
            }
            if (_this.timedoutPlayer === index) {
                gameState += '-timedOut';
            }
            player.channel.send('game', "end " + gameState);
            player.channel.removeAllHandlers();
        });
        this.resetPlayers();
        if (delay && delay > 0) {
            setTimeout(function () {
                _this.resolve(true);
            }, delay);
        }
        else {
            this.resolve(true);
        }
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
    return Game;
}());
exports["default"] = Game;
//# sourceMappingURL=Game.js.map
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
var UTTT_1 = require("@socialgorithm/ultimate-ttt/dist/UTTT");
var funcs = require("../../../lib/funcs");
var Subscriber_1 = require("../../model/Subscriber");
var events_1 = require("../../../events");
var Game = (function (_super) {
    __extends(Game, _super);
    function Game(matchID, players, options, events, log) {
        var _this = _super.call(this) || this;
        _this.matchID = matchID;
        _this.players = players;
        _this.options = options;
        _this.events = events;
        _this.log = log;
        _this.game = new UTTT_1["default"]();
        _this.players.forEach(function (player, index) {
            _this.subscribeNamespaced(player.token, events_1.PLAYER_DATA, _this.handlePlayerMove(player, index));
        });
        return _this;
    }
    Game.prototype.start = function () {
        this.gameStart = process.hrtime();
        this.currentPlayerIndex = 0;
        this.sendToPlayer(this.players[0], 'game', 'init');
        this.sendToPlayer(this.players[1], 'game', 'init');
        this.sendToPlayer(this.players[this.currentPlayerIndex], 'game', 'move');
    };
    Game.prototype.onFinish = function () {
        this.unsubscribeAll();
        this.publishNamespaced(this.matchID, events_1.GAME_END, this);
    };
    Game.prototype.handlePlayerMove = function (player, playerIndex) {
        var _this = this;
        return function (data) {
            if (_this.currentPlayerIndex !== playerIndex) {
                _this.log("Game " + _this.options.gameId + ": Player " + player.token + " played out of turn (it was " + _this.players[_this.currentPlayerIndex].token + "'s turn)");
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
                _this.sendToPlayer(_this.players[_this.currentPlayerIndex], 'game', "opponent " + _this.writeMove(coords));
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
        this.winnerIndex = this.switchPlayer(winnerIndex);
        this.handleGameEnd();
    };
    Game.prototype.handleGameTied = function () {
        this.winnerIndex = -1;
        this.handleGameEnd();
    };
    Game.prototype.handleGameEnd = function () {
        var _this = this;
        var hrend = process.hrtime(this.gameStart);
        this.gameTime = funcs.convertExecTime(hrend[1]);
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
            _this.sendToPlayer(player, 'game', "end " + gameState);
        });
        this.onFinish();
    };
    Game.prototype.sendToPlayer = function (player, type, data) {
        this.publishNamespaced(player.token, events_1.SEND_PLAYER_DATA, {
            type: type,
            data: data
        });
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
}(Subscriber_1["default"]));
exports["default"] = Game;
//# sourceMappingURL=Game.js.map
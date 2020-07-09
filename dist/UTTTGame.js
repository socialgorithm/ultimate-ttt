"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:uttt:game");
var UTTT_1 = require("@socialgorithm/ultimate-ttt/dist/UTTT");
var UTTTGame = (function () {
    function UTTTGame(players, sendMessageToPlayer, sendGameEnded, options) {
        this.players = players;
        this.sendMessageToPlayer = sendMessageToPlayer;
        this.sendGameEnded = sendGameEnded;
        this.options = options;
        this.board = new UTTT_1["default"](3);
        this.nextPlayerIndex = Math.round(Math.random());
        this.hasTimedOut = false;
    }
    UTTTGame.prototype.start = function () {
        this.startTime = Math.round(Date.now() / 1000);
        this.sendMessageToPlayer(this.players[0], "init");
        this.sendMessageToPlayer(this.players[1], "init");
        this.askForMoveFromNextPlayer();
    };
    UTTTGame.prototype.onMessageFromPlayer = function (player, payload) {
        this.onPlayerMove(player, payload);
    };
    UTTTGame.prototype.getNextPlayer = function () {
        return this.players[this.nextPlayerIndex];
    };
    UTTTGame.prototype.onPlayerMove = function (player, moveStr) {
        if (this.hasTimedOut) {
            return;
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        var coords = this.parseMove(moveStr);
        var expectedPlayerIndex = this.nextPlayerIndex;
        var playedPlayerIndex = this.players.indexOf(player);
        if (expectedPlayerIndex !== playedPlayerIndex) {
            var expectedPlayer = this.players[expectedPlayerIndex];
            debug("Expected " + expectedPlayer + " to play, but " + player + " played");
            this.handleGameWon(this.players[expectedPlayerIndex], undefined, playedPlayerIndex);
            return;
        }
        this.board = this.board.move(playedPlayerIndex, coords.board, coords.move);
        var previousMove = coords;
        if (this.board.isFinished()) {
            this.handleGameEnd(previousMove, playedPlayerIndex);
            return;
        }
        else {
            this.switchNextPlayer();
            this.askForMoveFromNextPlayer(previousMove);
        }
    };
    UTTTGame.prototype.parseMove = function (data) {
        var _a = data.trim().split(";")
            .map(function (part) { return part.split(",").map(function (n) { return parseInt(n, 10); }); }), board = _a[0], move = _a[1];
        return { board: board, move: move };
    };
    UTTTGame.prototype.askForMoveFromNextPlayer = function (previousMove) {
        var _this = this;
        var nextPlayer = this.players[this.nextPlayerIndex];
        if (previousMove) {
            var coords = this.printCoords(previousMove);
            this.sendMessageToPlayer(nextPlayer, "opponent " + coords);
        }
        else {
            this.sendMessageToPlayer(nextPlayer, "move");
        }
        this.timeout = setTimeout(function () {
            _this.hasTimedOut = true;
            _this.sendMessageToPlayer(_this.players[_this.nextPlayerIndex], "timeout");
            _this.handleGameWon(_this.players[1 - _this.nextPlayerIndex], undefined, _this.nextPlayerIndex);
        }, this.options.timeout * 1.2);
    };
    UTTTGame.prototype.switchNextPlayer = function () {
        this.nextPlayerIndex = this.nextPlayerIndex === 0 ? 1 : 0;
    };
    UTTTGame.prototype.handleGameEnd = function (previousMove, playedPlayerIndex) {
        if (this.board.winner === -1) {
            this.handleGameTied(previousMove, playedPlayerIndex);
        }
        else {
            var winnerName = this.players[this.board.winner];
            this.handleGameWon(winnerName, previousMove, playedPlayerIndex);
        }
    };
    UTTTGame.prototype.handleGameTied = function (previousMove, playedPlayerIndex) {
        this.sendGameEnded({
            duration: this.getTimeFromStart(),
            players: this.players,
            stats: {
                playedPlayerIndex: playedPlayerIndex,
                previousMove: previousMove ? this.printCoords(previousMove) : ""
            },
            tie: true,
            winner: null
        });
    };
    UTTTGame.prototype.handleGameWon = function (winner, previousMove, playedPlayerIndex) {
        this.sendGameEnded({
            duration: this.getTimeFromStart(),
            players: this.players,
            stats: {
                playedPlayerIndex: playedPlayerIndex,
                previousMove: previousMove ? this.printCoords(previousMove) : ""
            },
            tie: false,
            winner: winner
        });
    };
    UTTTGame.prototype.getTimeFromStart = function () {
        var timeNow = Math.round(Date.now() / 1000);
        return timeNow - this.startTime;
    };
    UTTTGame.prototype.printCoords = function (coords) {
        return coords.board.join(",") + ";" + coords.move.join(",");
    };
    return UTTTGame;
}());
exports["default"] = UTTTGame;
//# sourceMappingURL=UTTTGame.js.map
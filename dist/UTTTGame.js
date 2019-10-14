"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:uttt:game");
var UTTT_1 = require("@socialgorithm/ultimate-ttt/dist/UTTT");
var UTTTGame = (function () {
    function UTTTGame(players, sendMessageToPlayer, sendGameEnded) {
        this.players = players;
        this.sendMessageToPlayer = sendMessageToPlayer;
        this.sendGameEnded = sendGameEnded;
        this.board = new UTTT_1["default"](3);
        this.nextPlayerIndex = Math.round(Math.random());
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
    UTTTGame.prototype.onPlayerMove = function (player, moveStr) {
        var coords = this.parseMove(moveStr);
        var expectedPlayerIndex = this.nextPlayerIndex;
        var playedPlayerIndex = this.players.indexOf(player);
        if (expectedPlayerIndex !== playedPlayerIndex) {
            var expectedPlayer = this.players[expectedPlayerIndex];
            debug("Expected " + expectedPlayer + " to play, but " + player + " played");
            this.handleGameWon(expectedPlayerIndex);
            return;
        }
        try {
            this.board = this.board.move(playedPlayerIndex, coords.board, coords.move);
            if (this.board.isFinished()) {
                var previousMove = coords;
                this.handleGameEnd(previousMove, playedPlayerIndex);
                return;
            }
            else {
                var previousMove = coords;
                this.switchNextPlayer();
                this.askForMoveFromNextPlayer(previousMove);
            }
        }
        catch (e) {
            var expectedPlayer = this.players[expectedPlayerIndex];
            var winningPlayer = this.players[1 - expectedPlayerIndex];
            debug(expectedPlayer + " Caused An Error, so " + winningPlayer + " won");
            this.handleGameWon(winningPlayer);
            return;
        }
    };
    UTTTGame.prototype.parseMove = function (data) {
        var _a = data.trim().split(";")
            .map(function (part) { return part.split(",").map(function (n) { return parseInt(n, 10); }); }), board = _a[0], move = _a[1];
        return { board: board, move: move };
    };
    UTTTGame.prototype.askForMoveFromNextPlayer = function (previousMove) {
        var nextPlayer = this.players[this.nextPlayerIndex];
        if (previousMove) {
            var coords = this.printCoords(previousMove);
            this.sendMessageToPlayer(nextPlayer, "opponent " + coords);
        }
        else {
            this.sendMessageToPlayer(nextPlayer, "move");
        }
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
                board: this.board,
                previousMove: previousMove,
                playedPlayerIndex: playedPlayerIndex
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
                board: this.board,
                previousMove: previousMove,
                playedPlayerIndex: playedPlayerIndex
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
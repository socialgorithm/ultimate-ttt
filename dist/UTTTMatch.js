"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:uttt:match");
var UTTTGame_1 = require("./UTTTGame");
var UTTTMatch = (function () {
    function UTTTMatch(options, players, outputChannel) {
        var _a;
        var _this = this;
        this.options = options;
        this.players = players;
        this.outputChannel = outputChannel;
        this.gamesCompleted = [];
        this.missingPlayers = [];
        this.playNextGame = function () {
            _this.currentGame = new UTTTGame_1["default"](_this.players, _this.onGameMessageToPlayer, _this.onGameEnded);
            _this.currentGame.start();
        };
        this.onGameMessageToPlayer = function (player, message) {
            _this.outputChannel.sendMessageToPlayer(player, message);
        };
        this.onGameEnded = function (stats) {
            _this.outputChannel.sendGameEnded(stats);
            _this.gamesCompleted.push(stats);
            if (stats.winner) {
                var winningIndex = _this.players.indexOf(stats.winner);
                if (winningIndex !== -1) {
                    _this.onGameMessageToPlayer(_this.players[winningIndex], "game win");
                    _this.onGameMessageToPlayer(_this.players[1 - winningIndex], "game lose" + (stats.stats.previousMove ? " " + stats.stats.previousMove : ''));
                }
            }
            else {
                _this.onGameMessageToPlayer(_this.players[0], "game tie" + (stats.stats.playedPlayerIndex !== 0 && stats.stats.previousMove ? " " + stats.stats.previousMove : ''));
                _this.onGameMessageToPlayer(_this.players[1], "game tie" + (stats.stats.playedPlayerIndex !== 1 && stats.stats.previousMove ? " " + stats.stats.previousMove : ''));
            }
            if (_this.gamesCompleted.length < _this.options.maxGames) {
                if (_this.isMatchWinnable())
                    _this.playNextGame();
                else
                    _this.endMatch();
            }
            else if (_this.hasUnaminusWinner()) {
                _this.endMatch();
            }
            else {
                _this.playNextGame();
            }
        };
        this.endMatch = function () {
            var gamesTied = _this.gamesCompleted.filter(function (game) { return game.tie; }).length;
            var gameWonPlayer1 = _this.gamesCompleted.filter(function (game) { return !game.tie && _this.players[0] === game.winner; }).length;
            var gameWonPlayer2 = _this.gamesCompleted.filter(function (game) { return !game.tie && _this.players[1] === game.winner; }).length;
            var winner = gameWonPlayer1 === gameWonPlayer2 ? -1 : gameWonPlayer1 > gameWonPlayer2 ? 0 : 1;
            var winningMessage = winner === -1 ? "Game Tie" : _this.players[winner] + " Won";
            if (winner !== -1) {
                _this.onGameMessageToPlayer(_this.players[winner], "match win");
                _this.onGameMessageToPlayer(_this.players[1 - winner], "match lose");
            }
            else {
                _this.onGameMessageToPlayer(_this.players[winner], "match tie");
                _this.onGameMessageToPlayer(_this.players[1 - winner], "match tie");
            }
            var matchEndedMessage = {
                games: _this.gamesCompleted,
                matchID: "--",
                messages: [winningMessage],
                options: _this.options,
                players: _this.players,
                state: "finished",
                stats: {
                    gamesCompleted: _this.gamesCompleted.length,
                    gamesTied: gamesTied,
                    wins: [gameWonPlayer1, gameWonPlayer2]
                },
                winner: winner
            };
            _this.outputChannel.sendMatchEnded(matchEndedMessage);
        };
        this.sendMatchEndDueToTimeout = function (missingPlayer) {
            var winnerIndex = -1;
            var timeoutMessage = "Players did not connect in time";
            if (missingPlayer) {
                var winner_1 = _this.players.find(function (player) { return player !== missingPlayer; });
                winnerIndex = _this.players.findIndex(function (player) { return player === winner_1; });
                timeoutMessage = missingPlayer + " did not connect in time, or disconnected";
            }
            var matchEndedMessage = {
                games: [],
                matchID: "--",
                messages: [timeoutMessage],
                options: _this.options,
                players: _this.players,
                state: "finished",
                stats: {
                    gamesCompleted: 0,
                    gamesTied: 0,
                    wins: [0, 0]
                },
                winner: winnerIndex
            };
            debug("Sending match ended due to timeout %O", matchEndedMessage);
            _this.outputChannel.sendMatchEnded(matchEndedMessage);
        };
        (_a = this.missingPlayers).push.apply(_a, players);
        setTimeout(function () {
            if (_this.missingPlayers.length === 1) {
                debug(_this.missingPlayers[0] + " did not connect to match, sending match end");
                _this.sendMatchEndDueToTimeout(_this.missingPlayers[0]);
            }
            else if (_this.missingPlayers.length > 1) {
                debug("Players did not connect to match, sending match end");
                _this.sendMatchEndDueToTimeout();
            }
        }, 5000);
    }
    UTTTMatch.prototype.onPlayerConnected = function (player) {
        debug("Player " + player + " connected to match");
        this.missingPlayers = this.missingPlayers.filter(function (missingPlayer) { return player !== missingPlayer; });
    };
    UTTTMatch.prototype.onPlayerDisconnected = function (player) {
        debug("Player " + player + " disconnected from match");
        if (!this.missingPlayers.find(function (missingPlayer) { return missingPlayer === player; })) {
            this.missingPlayers.push(player);
        }
        this.sendMatchEndDueToTimeout(player);
    };
    UTTTMatch.prototype.start = function () {
        debug("Starting new UTTT Match");
        this.playNextGame();
    };
    UTTTMatch.prototype.onMessageFromPlayer = function (player, message) {
        this.currentGame.onMessageFromPlayer(player, message);
    };
    UTTTMatch.prototype.isMatchWinnable = function () {
        var _this = this;
        var gameWonPlayer1 = this.gamesCompleted.filter(function (game) { return !game.tie && _this.players[0] === game.winner; }).length;
        var gameWonPlayer2 = this.gamesCompleted.filter(function (game) { return !game.tie && _this.players[1] === game.winner; }).length;
        var matchesLeft = this.options.maxGames - this.gamesCompleted.length;
        var diffBetweenScore = Math.abs(gameWonPlayer1 - gameWonPlayer2);
        if (matchesLeft > 0) {
            return matchesLeft >= diffBetweenScore;
        }
        return false;
    };
    UTTTMatch.prototype.hasUnaminusWinner = function () {
        var _this = this;
        var gameWonPlayer1 = this.gamesCompleted.filter(function (game) { return !game.tie && _this.players[0] === game.winner; }).length;
        var gameWonPlayer2 = this.gamesCompleted.filter(function (game) { return !game.tie && _this.players[1] === game.winner; }).length;
        if (this.gamesCompleted.length % 2 === 0) {
            if (gameWonPlayer1 > gameWonPlayer2)
                return true;
            if (gameWonPlayer2 > gameWonPlayer1)
                return true;
        }
        else {
            if (gameWonPlayer1 - 1 > gameWonPlayer2)
                return true;
            if (gameWonPlayer2 - 1 > gameWonPlayer1)
                return true;
        }
        return false;
    };
    return UTTTMatch;
}());
exports["default"] = UTTTMatch;
//# sourceMappingURL=UTTTMatch.js.map
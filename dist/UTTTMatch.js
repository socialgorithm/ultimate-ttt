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
            _this.currentGame = new UTTTGame_1["default"](_this.players, _this.onGameMessageToPlayer, _this.onGameEnded, _this.options);
            _this.currentGame.start();
        };
        this.onGameMessageToPlayer = function (player, message) {
            _this.outputChannel.sendMessageToPlayer(player, message);
        };
        this.onGameEnded = function (stats) {
            _this.outputChannel.sendGameEnded(stats);
            _this.gamesCompleted.push(stats);
            if (_this.gamesCompleted.length < _this.options.maxGames) {
                _this.messageGameEnd(stats);
                _this.playNextGame();
            }
            else {
                _this.endMatch();
            }
        };
        this.messageGameEnd = function (stats) {
            if (stats.winner) {
                var winningIndex = _this.players.indexOf(stats.winner);
                if (winningIndex !== -1) {
                    _this.onGameMessageToPlayer(_this.players[winningIndex], "game win");
                    _this.onGameMessageToPlayer(_this.players[1 - winningIndex], stats.stats.previousMove ? "game lose " + stats.stats.previousMove : "game lose");
                }
            }
            else {
                _this.onGameMessageToPlayer(_this.players[0], stats.stats.playedPlayerIndex !== 0 ? "game tie " + stats.stats.previousMove : "game tie");
                _this.onGameMessageToPlayer(_this.players[1], stats.stats.playedPlayerIndex !== 1 ? "game tie " + stats.stats.previousMove : "game tie");
            }
        };
        this.endMatch = function () {
            var stats = _this.getGameStats();
            var winner = stats.wins[0] === stats.wins[1] ? -1 : stats.wins[0] > stats.wins[1] ? 0 : 1;
            _this.sendEndMatchMessages(winner, stats);
        };
        this.getGameStats = function () {
            var gamesTied = _this.gamesCompleted.filter(function (game) { return game.tie; }).length;
            var gameWonPlayer1 = _this.gamesCompleted.filter(function (game) { return !game.tie && _this.players[0] === game.winner; }).length;
            var gameWonPlayer2 = _this.gamesCompleted.filter(function (game) { return !game.tie && _this.players[1] === game.winner; }).length;
            return {
                gamesCompleted: _this.gamesCompleted.length,
                gamesTied: gamesTied,
                wins: [gameWonPlayer1, gameWonPlayer2]
            };
        };
        this.sendEndMatchMessages = function (winner, stats) {
            var winningMessage = winner === -1 ? "Match Tie" : "Match Won" + _this.players[winner];
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
                stats: stats,
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
    return UTTTMatch;
}());
exports["default"] = UTTTMatch;
//# sourceMappingURL=UTTTMatch.js.map
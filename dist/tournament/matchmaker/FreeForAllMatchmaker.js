"use strict";
exports.__esModule = true;
var Match_1 = require("../match/Match");
var FreeForAllMatchmaker = (function () {
    function FreeForAllMatchmaker(players, options, sendStats) {
        this.players = players;
        this.options = options;
        this.sendStats = sendStats;
        this.maxMatches = Math.pow(players.length, players.length);
    }
    FreeForAllMatchmaker.prototype.isFinished = function () {
        return this.finished;
    };
    FreeForAllMatchmaker.prototype.getRemainingMatches = function (tournamentStats) {
        var _this = this;
        var match = [];
        this.finished = true;
        return this.players.map(function (playerA, $index) {
            return _this.players.splice($index + 1).map(function (playerB) {
                return new Match_1["default"]([playerA, playerB], {
                    maxGames: _this.options.maxGames,
                    timeout: _this.options.timeout
                }, _this.sendStats);
            });
        }).reduce(function (result, current, idx) {
            return result.concat(current);
        }, []);
    };
    FreeForAllMatchmaker.prototype.getRanking = function (stats) {
        var playerStats = {};
        stats.matches.forEach(function (match) {
            if (!playerStats[match.players[0].token]) {
                playerStats[match.players[0].token] = 0;
            }
            if (!playerStats[match.players[1].token]) {
                playerStats[match.players[1].token] = 0;
            }
            playerStats[match.players[0].token] += match.stats.wins[0];
            playerStats[match.players[1].token] += match.stats.wins[1];
        });
        return Object.keys(playerStats).map(function (token) { return ({
            player: token,
            gamesWon: playerStats[token]
        }); }).sort(function (a, b) { return b.gamesWon - a.gamesWon; }).map(function (playerRank) { return playerRank.player; });
    };
    return FreeForAllMatchmaker;
}());
exports["default"] = FreeForAllMatchmaker;
//# sourceMappingURL=FreeForAllMatchmaker.js.map
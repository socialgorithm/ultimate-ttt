"use strict";
exports.__esModule = true;
var Match_1 = require("../match/Match");
var FreeForAllMatchmaker = (function () {
    function FreeForAllMatchmaker(players, options) {
        this.players = players;
        this.options = options;
        this.maxMatches = Math.pow(players.length, players.length);
    }
    FreeForAllMatchmaker.prototype.isFinished = function () {
        return this.finished;
    };
    FreeForAllMatchmaker.prototype.getRemainingMatches = function (tournamentId, tournamentStats) {
        var _this = this;
        var match = [];
        this.finished = true;
        return this.players.map(function (playerA, $index) {
            return _this.players.slice($index + 1).map(function (playerB) {
                return new Match_1["default"](tournamentId, [playerA, playerB], {
                    maxGames: _this.options.maxGames,
                    timeout: _this.options.timeout
                });
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
            var p0wins = match.stats.wins[0];
            var p1wins = match.stats.wins[1];
            if (p0wins === p1wins) {
                return;
            }
            if (p0wins > p1wins) {
                playerStats[match.players[0].token]++;
            }
            if (p1wins > p0wins) {
                playerStats[match.players[1].token]++;
            }
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
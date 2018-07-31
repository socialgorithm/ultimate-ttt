"use strict";
exports.__esModule = true;
var Match_1 = require("../match/Match");
var DoubleEliminationMatchmaker = (function () {
    function DoubleEliminationMatchmaker(players, options, sendStats) {
        var _this = this;
        this.players = players;
        this.options = options;
        this.sendStats = sendStats;
        this.processedMatches = [];
        this.playerStats = {};
        this.players.forEach(function (player) {
            _this.playerStats[player.token] = { player: player, wins: 0, losses: 0 };
        });
        this.waitingToPlay = [];
    }
    DoubleEliminationMatchmaker.prototype.isFinished = function () {
        return this.finished;
    };
    DoubleEliminationMatchmaker.prototype.getRemainingMatches = function (tournamentStats) {
        var _this = this;
        this.tournamentStats = tournamentStats;
        var matches = [];
        if (tournamentStats.matches.length === 0) {
            return this.matchPlayers(this.players);
        }
        var justPlayedMatches = this.tournamentStats.matches.filter(function (match) {
            return _this.processedMatches.indexOf(match.uuid) === -1;
        });
        justPlayedMatches.forEach(function (match) {
            _this.processedMatches.push(match.uuid);
            var winnerToken = match.players[match.stats.winner].token;
            var loserToken = match.players[match.stats.winner === 1 ? 0 : 1].token;
            _this.playerStats[winnerToken].wins++;
            _this.playerStats[loserToken].losses++;
        });
        console.log(this.playerStats);
        if (justPlayedMatches.length === 1 && this.waitingToPlay.length < 1) {
            this.finished = true;
            return [];
        }
        var zeroLossPlayers = [];
        var oneLossPlayers = [];
        for (var playerToken in this.playerStats) {
            var stats = this.playerStats[playerToken];
            if (stats.losses === 0) {
                zeroLossPlayers.push(stats.player);
            }
            else if (stats.losses === 1) {
                oneLossPlayers.push(stats.player);
            }
        }
        if (zeroLossPlayers.length > 1) {
            matches = matches.concat(this.matchPlayers(zeroLossPlayers));
        }
        else if (zeroLossPlayers.length === 1) {
            console.log("zero loss last: " + zeroLossPlayers[0].token);
            this.waitingToPlay.push(zeroLossPlayers[0]);
        }
        if (oneLossPlayers.length > 1) {
            matches = matches.concat(this.matchPlayers(oneLossPlayers));
        }
        else if (oneLossPlayers.length === 1) {
            console.log("one loss last: " + zeroLossPlayers[0].token);
            this.waitingToPlay.push(oneLossPlayers[0]);
        }
        if (this.waitingToPlay.length > 1) {
            console.log("Matching waiters");
            matches = matches.concat(this.matchPlayers(this.waitingToPlay));
            this.waitingToPlay = [];
        }
        return matches;
    };
    DoubleEliminationMatchmaker.prototype.matchPlayers = function (players) {
        var matches = [];
        var oddPlayerExists = false;
        var evenLimit = players.length;
        if (players.length < 2) {
            return matches;
        }
        if (players.length % 2 !== 0) {
            oddPlayerExists = true;
            evenLimit = players.length - 1;
        }
        for (var i = 0; i < evenLimit; i += 2) {
            var playerA = players[i];
            var playerB = players[i + 1];
            matches.push(new Match_1["default"]([playerA, playerB], this.options, this.sendStats));
        }
        if (oddPlayerExists) {
            var oddPlayer = players[evenLimit + 1];
            var randomlyPickedPlayer = players[Math.floor(Math.random() * evenLimit)];
            matches.push(new Match_1["default"]([oddPlayer, randomlyPickedPlayer], this.options, this.sendStats));
        }
        return matches;
    };
    DoubleEliminationMatchmaker.prototype.getRanking = function () {
        var _this = this;
        return this.players
            .sort(function (a, b) { return _this.playerStats[b.token].wins - _this.playerStats[a.token].wins; })
            .map(function (player) { return player.token; });
    };
    return DoubleEliminationMatchmaker;
}());
exports["default"] = DoubleEliminationMatchmaker;
//# sourceMappingURL=DoubleEliminationMatchmaker.js.map
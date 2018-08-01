"use strict";
exports.__esModule = true;
var constants_1 = require("@socialgorithm/ultimate-ttt/dist/model/constants");
var DoubleEliminationMatch_1 = require("./DoubleEliminationMatch");
var DoubleEliminationMatchmaker = (function () {
    function DoubleEliminationMatchmaker(players, options, sendStats) {
        var _this = this;
        this.players = players;
        this.options = options;
        this.sendStats = sendStats;
        this.unlinkedMatches = [];
        this.processedMatches = [];
        this.playerStats = {};
        this.players.forEach(function (player) {
            _this.playerStats[player.token] = { player: player, wins: 0, losses: 0 };
        });
        this.waitingForFinal = [];
    }
    DoubleEliminationMatchmaker.prototype.isFinished = function () {
        return this.finished;
    };
    DoubleEliminationMatchmaker.prototype.getRemainingMatches = function (tournamentStats) {
        var _this = this;
        this.tournamentStats = tournamentStats;
        var matches = [];
        if (tournamentStats.matches.length === 0) {
            var matchResult = this.matchPlayers(this.players);
            this.zeroLossOddPlayer = matchResult.oddPlayer;
            return matchResult.matches;
        }
        var justPlayedMatches = this.tournamentStats.matches.filter(function (match) {
            return _this.processedMatches.indexOf(match.uuid) === -1;
        });
        var tiedPlayers = [];
        justPlayedMatches.forEach(function (match) {
            _this.processedMatches.push(match.uuid);
            if (match.stats.winner === constants_1.RESULT_TIE) {
                matches.push(_this.createMatch(match.players[0], match.players[1], { timeout: match.options.timeout / 2 }));
                tiedPlayers.push.apply(tiedPlayers, match.players);
            }
            else {
                var winnerToken = match.players[match.stats.winner].token;
                var loserToken = match.players[match.stats.winner === 1 ? 0 : 1].token;
                _this.playerStats[winnerToken].wins++;
                _this.playerStats[loserToken].losses++;
            }
        });
        if (matches.length < 1 && justPlayedMatches.length === 1 && this.waitingForFinal.length < 1) {
            this.finished = true;
            return [];
        }
        var zeroLossPlayers = [];
        var oneLossPlayers = [];
        for (var playerToken in this.playerStats) {
            var stats = this.playerStats[playerToken];
            if (!this.playerIsWaitingForMatch(stats.player) && tiedPlayers.indexOf(stats.player) === -1)
                if (stats.losses === 0) {
                    zeroLossPlayers.push(stats.player);
                }
                else if (stats.losses === 1) {
                    oneLossPlayers.push(stats.player);
                }
        }
        if (this.zeroLossOddPlayer != null) {
            zeroLossPlayers.unshift(this.zeroLossOddPlayer);
            delete this.zeroLossOddPlayer;
        }
        if (this.oneLossOddPlayer != null) {
            oneLossPlayers.unshift(this.oneLossOddPlayer);
            delete this.oneLossOddPlayer;
        }
        if (zeroLossPlayers.length > 1) {
            var matchResult = this.matchPlayers(zeroLossPlayers);
            matches.push.apply(matches, matchResult.matches);
            this.zeroLossOddPlayer = matchResult.oddPlayer;
        }
        else if (zeroLossPlayers.length === 1) {
            this.waitingForFinal.push(zeroLossPlayers[0]);
        }
        if (oneLossPlayers.length > 1) {
            var matchResult = this.matchPlayers(oneLossPlayers);
            matches.push.apply(matches, matchResult.matches);
            this.oneLossOddPlayer = matchResult.oddPlayer;
        }
        else if (oneLossPlayers.length === 1) {
            this.waitingForFinal.push(oneLossPlayers[0]);
        }
        if (tiedPlayers.length > 0) {
        }
        if (this.waitingForFinal.length > 1) {
            var matchResult = this.matchPlayers(this.waitingForFinal);
            matches.push.apply(matches, matchResult.matches);
            this.waitingForFinal = [];
        }
        return matches;
    };
    DoubleEliminationMatchmaker.prototype.matchPlayers = function (players, optionOverrides) {
        var _this = this;
        var _a;
        var matches = [];
        var oddPlayer;
        if (players.length < 2) {
            return {};
        }
        if (players.length % 2 !== 0) {
            oddPlayer = players[players.length - 1];
            players = players.slice(0, -1);
        }
        for (var i = 0; i < players.length; i += 2) {
            var playerA = players[i];
            var playerB = players[i + 1];
            matches.push(this.createMatch(playerA, playerB));
        }
        matches.forEach(function (match) {
            _this.setParentMatches(match);
        });
        (_a = this.unlinkedMatches).push.apply(_a, matches);
        return { matches: matches, oddPlayer: oddPlayer };
    };
    DoubleEliminationMatchmaker.prototype.createMatch = function (playerA, playerB, optionOverrides) {
        var finalOptions = Object.assign(this.options, optionOverrides || {});
        return new DoubleEliminationMatch_1["default"]([playerA, playerB], finalOptions, this.sendStats);
    };
    DoubleEliminationMatchmaker.prototype.playerIsWaitingForMatch = function (player) {
        return this.waitingForFinal.indexOf(player) >= 0 || player === this.zeroLossOddPlayer || player === this.oneLossOddPlayer;
    };
    DoubleEliminationMatchmaker.prototype.setParentMatches = function (match) {
        var _this = this;
        var playerTokens = match.players.map(function (player) { return player.token; });
        var parentMatches = this.unlinkedMatches.filter(function (match) {
            var winner = match.players[match.stats.winner];
            if (!winner) {
                return false;
            }
            return playerTokens.indexOf(winner.token) > -1;
        }).map(function (match) {
            var winner = match.players[match.stats.winner];
            return {
                playerIndex: playerTokens.indexOf(winner.token),
                parent: match.uuid
            };
        });
        parentMatches.forEach(function (matchParent) {
            var unlinkedIndex = _this.unlinkedMatches.findIndex(function (eachMatch) { return eachMatch.uuid === matchParent.parent; });
            _this.unlinkedMatches.splice(unlinkedIndex, 1);
        });
        match.parentMatches = parentMatches;
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
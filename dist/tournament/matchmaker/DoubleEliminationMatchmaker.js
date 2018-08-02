"use strict";
exports.__esModule = true;
var constants_1 = require("@socialgorithm/ultimate-ttt/dist/model/constants");
var DoubleEliminationMatch_1 = require("./DoubleEliminationMatch");
var DoubleEliminationMatchmaker = (function () {
    function DoubleEliminationMatchmaker(players, options, events) {
        var _this = this;
        this.players = players;
        this.options = options;
        this.events = events;
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
    DoubleEliminationMatchmaker.prototype.updateStats = function (tournamentStats) {
        var _this = this;
        this.tournamentStats = tournamentStats;
        var justPlayedMatches = this.tournamentStats.matches.filter(function (match) {
            return _this.processedMatches.indexOf(match.uuid) === -1;
        });
        justPlayedMatches.forEach(function (match) {
            if (match.stats.winner !== constants_1.RESULT_TIE) {
                var winnerToken = match.players[match.stats.winner].token;
                var loserToken = match.players[match.stats.winner === 1 ? 0 : 1].token;
                _this.playerStats[winnerToken].wins++;
                _this.playerStats[loserToken].losses++;
            }
        });
    };
    DoubleEliminationMatchmaker.prototype.getRemainingMatches = function () {
        var _this = this;
        var matches = [];
        if (this.tournamentStats.matches.length === 0) {
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
                matches.push(_this.createMatch(match.players[0], match.players[1], { timeout: match.options.timeout / 2 }, [{ playerIndex: 0, parent: match.uuid }, { playerIndex: 1, parent: match.uuid }]));
                tiedPlayers.push.apply(tiedPlayers, match.players);
            }
        });
        if (matches.length < 1 && justPlayedMatches.length === 1 && !this.anyPlayersWaiting()) {
            this.finished = true;
            return [];
        }
        var zeroLossPlayers = [];
        var oneLossPlayers = [];
        Object.keys(this.playerStats).forEach(function (playerToken) {
            var stats = _this.playerStats[playerToken];
            if (!_this.playerIsWaitingForMatch(stats.player) && tiedPlayers.indexOf(stats.player) === -1) {
                if (stats.losses === 0) {
                    zeroLossPlayers.push(stats.player);
                }
                else if (stats.losses === 1) {
                    oneLossPlayers.push(stats.player);
                }
            }
        });
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
        if (this.waitingForFinal.length > 1) {
            var matchResult = this.matchPlayers(this.waitingForFinal);
            matches.push.apply(matches, matchResult.matches);
            this.waitingForFinal = [];
        }
        return matches;
    };
    DoubleEliminationMatchmaker.prototype.getRanking = function () {
        if (this.tournamentStats.finished) {
            return this.finishedRanking();
        }
        else {
            return this.unfinishedRanking();
        }
    };
    DoubleEliminationMatchmaker.prototype.finishedRanking = function () {
        var ranking = [];
        var matches = this.tournamentStats.matches.map(function (match) { return match; });
        matches.reverse().forEach(function (match) {
            if (match.stats.winner !== constants_1.RESULT_TIE) {
                var winner = match.players[match.stats.winner].token;
                var loser = match.players[match.stats.winner === 1 ? 0 : 1].token;
                if (ranking.indexOf(winner) === -1) {
                    ranking.push(winner);
                }
                if (ranking.indexOf(loser) === -1) {
                    ranking.push(loser);
                }
            }
        });
        var playersAwaitingMatch = this.players.map(function (player) { return player.token; }).filter(function (token) { return ranking.indexOf(token) === -1; });
        ranking.push.apply(ranking, playersAwaitingMatch);
        return ranking;
    };
    DoubleEliminationMatchmaker.prototype.unfinishedRanking = function () {
        var _this = this;
        return this.players
            .sort(function (a, b) { return _this.getPlayerScore(b) - _this.getPlayerScore(a); }).map(function (player) { return player.token; });
    };
    DoubleEliminationMatchmaker.prototype.getPlayerScore = function (player) {
        return this.playerStats[player.token].wins / (this.playerStats[player.token].losses + this.playerStats[player.token].losses);
    };
    DoubleEliminationMatchmaker.prototype.matchPlayers = function (players) {
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
        return { matches: matches, oddPlayer: oddPlayer };
    };
    DoubleEliminationMatchmaker.prototype.createMatch = function (playerA, playerB, optionOverrides, parentMatches) {
        var finalOptions = Object.assign(this.options, optionOverrides || {});
        var match = new DoubleEliminationMatch_1["default"]([playerA, playerB], finalOptions, this.events);
        if (parentMatches) {
            match.parentMatches = parentMatches;
        }
        else {
            this.setParentMatches(match);
        }
        this.unlinkedMatches.push(match);
        return match;
    };
    DoubleEliminationMatchmaker.prototype.playerIsWaitingForMatch = function (player) {
        return this.waitingForFinal.indexOf(player) >= 0 || player === this.zeroLossOddPlayer || player === this.oneLossOddPlayer;
    };
    DoubleEliminationMatchmaker.prototype.anyPlayersWaiting = function () {
        return this.waitingForFinal.length > 0 || !!this.zeroLossOddPlayer || !!this.oneLossOddPlayer;
    };
    DoubleEliminationMatchmaker.prototype.setParentMatches = function (match) {
        var _this = this;
        var playerTokens = match.players.map(function (player) { return player.token; });
        var parentMatches = this.unlinkedMatches.filter(function (eachMatch) {
            var winner = eachMatch.players[eachMatch.stats.winner];
            if (!winner) {
                return false;
            }
            return playerTokens.indexOf(winner.token) > -1;
        }).map(function (eachMatch) {
            var winner = eachMatch.players[eachMatch.stats.winner];
            return {
                parent: eachMatch.uuid,
                playerIndex: playerTokens.indexOf(winner.token)
            };
        });
        parentMatches.forEach(function (matchParent) {
            var unlinkedIndex = _this.unlinkedMatches.findIndex(function (eachMatch) { return eachMatch.uuid === matchParent.parent; });
            _this.unlinkedMatches.splice(unlinkedIndex, 1);
        });
        match.parentMatches = parentMatches;
    };
    return DoubleEliminationMatchmaker;
}());
exports["default"] = DoubleEliminationMatchmaker;
//# sourceMappingURL=DoubleEliminationMatchmaker.js.map
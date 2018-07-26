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
var uuid = require("uuid/v4");
var FreeForAllMatchmaker_1 = require("./matchmaker/FreeForAllMatchmaker");
var Subscriber_1 = require("./model/Subscriber");
var events_1 = require("../events");
var Tournament = (function (_super) {
    __extends(Tournament, _super);
    function Tournament(options, socket, players, lobbyToken) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.socket = socket;
        _this.players = players;
        _this.lobbyToken = lobbyToken;
        _this.stats = {
            started: false,
            finished: false,
            matches: []
        };
        _this.tournamentID = uuid();
        var matchOptions = {
            maxGames: _this.options.numberOfGames,
            timeout: _this.options.timeout
        };
        switch (options.type) {
            case 'FreeForAll':
            default:
                _this.matchmaker = new FreeForAllMatchmaker_1["default"](_this.players, matchOptions);
                break;
        }
        _this.subscribeNamespaced(_this.tournamentID, events_1.MATCH_END, _this.playNextMatch);
        return _this;
    }
    Tournament.prototype.start = function () {
        this.stats.started = true;
        this.playNextMatches();
    };
    Tournament.prototype.playNextMatch = function () {
        var nextMatch = this.stats.matches.find(function (match) { return match.stats.state === 'upcoming'; });
        if (!nextMatch) {
            return this.onAllMatchesEnd();
        }
        nextMatch.start();
    };
    Tournament.prototype.playNextMatches = function () {
        var matches = this.matchmaker.getRemainingMatches(this.tournamentID, this.stats);
        if (matches.length < 1) {
            return this.onTournamentEnd();
        }
        this.stats.matches = this.stats.matches.concat(matches);
        this.playNextMatch();
    };
    Tournament.prototype.onAllMatchesEnd = function () {
        if (this.matchmaker.isFinished()) {
            return this.onTournamentEnd();
        }
        this.playNextMatches();
    };
    Tournament.prototype.onTournamentEnd = function () {
        this.stats.finished = true;
        this.unsubscribeAll();
    };
    Tournament.prototype.isFinished = function () {
        return this.stats.finished;
    };
    Tournament.prototype.getStats = function () {
        return {
            options: this.options,
            started: this.stats.started,
            finished: this.stats.finished,
            matches: this.stats.matches.filter(function (match) { return match && match.stats; }).map(function (match) { return ({
                stats: match.stats,
                players: match.players.map(function (player) { return ({
                    token: player.token
                }); })
            }); }),
            ranking: this.matchmaker.getRanking(this.stats)
        };
    };
    return Tournament;
}(Subscriber_1["default"]));
exports.Tournament = Tournament;
//# sourceMappingURL=Tournament.js.map
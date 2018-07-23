"use strict";
exports.__esModule = true;
var FreeForAllMatchmaker_1 = require("./matchmaker/FreeForAllMatchmaker");
var Tournament = (function () {
    function Tournament(options, socket, players) {
        this.options = options;
        this.socket = socket;
        this.players = players;
        this.stats = {
            started: false,
            finished: false,
            matches: []
        };
        var matchOptions = {
            maxGames: this.options.numberOfGames,
            timeout: this.options.timeout
        };
        switch (options.type) {
            case 'FreeForAll':
            default:
                this.matchmaker = new FreeForAllMatchmaker_1["default"](this.players, matchOptions);
                break;
        }
    }
    Tournament.prototype.start = function () {
        if (!this.stats.started && !this.isFinished()) {
            console.log('Starting Tournament');
            this.stats.started = true;
            while (!this.matchmaker.isFinished()) {
                var matches = this.matchmaker.getRemainingMatches(this.stats);
                console.log('MatchMaker matches', matches);
                var playedMatches = this.playMatches(matches);
                this.stats.matches = this.stats.matches.concat(playedMatches);
            }
            console.log('finished games');
            this.stats.finished = true;
        }
    };
    Tournament.prototype.playMatches = function (matches) {
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var match = matches_1[_i];
            match.playGames();
        }
        return matches;
    };
    Tournament.prototype.isFinished = function () {
        return this.stats.finished;
    };
    return Tournament;
}());
exports.Tournament = Tournament;
//# sourceMappingURL=Tournament.js.map
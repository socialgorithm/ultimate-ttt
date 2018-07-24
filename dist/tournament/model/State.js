"use strict";
exports.__esModule = true;
var funcs = require("../../lib/funcs");
var State = (function () {
    function State() {
        this.games = 0;
        this.ties = 0;
        this.wins = [0, 0];
        this.times = [];
        this.timeouts = [0, 0];
        this.state = 'upcoming';
    }
    State.prototype.toJSON = function () {
        return {
            games: this.games,
            ties: this.ties,
            wins: this.wins,
            times: this.times,
            timeouts: this.timeouts,
            state: this.state
        };
    };
    State.prototype.printState = function () {
        var stats = this.getStats();
        console.log('');
        console.log('Games played: %d', this.games);
        console.log('Winner: %d', stats.winner);
        console.log('');
        console.log('Player 1 wins: %d (%s)', this.wins[0], stats.winPercentages[0]);
        console.log('Player 2 wins: %d (%s)', this.wins[1], stats.winPercentages[1]);
        console.log('Ties: %d (%s)', this.ties, stats.tiePercentage);
        console.log('');
        console.log('Player 1 timeouts: %d', this.timeouts[0]);
        console.log('Player 2 timeouts: %d', this.timeouts[1]);
        console.log('');
        console.log('Total time: %dms', stats.total);
        console.log('Avg game: %dms', stats.avg);
        console.log('Max game: %dms', stats.max);
        console.log('Min game: %dms', stats.min);
    };
    State.prototype.getStats = function () {
        var stats = {};
        if (this.wins[0] === this.wins[1]) {
            stats.winner = -1;
        }
        else if (this.wins[0] > this.wins[1]) {
            stats.winner = 0;
        }
        else {
            stats.winner = 1;
        }
        stats.winPercentages = [
            funcs.getPercentage(this.wins[0], this.games),
            funcs.getPercentage(this.wins[1], this.games)
        ];
        stats.tiePercentage = funcs.getPercentage(this.ties, this.games);
        var sum = 0;
        stats.total = 0;
        stats.max = 0;
        stats.avg = 0;
        stats.min = 1000;
        if (this.times.length > 0) {
            for (var i = 0; i < this.times.length; i++) {
                stats.total += this.times[i];
                sum += this.times[i];
                stats.max = Math.max(stats.max, this.times[i]);
                stats.min = Math.min(stats.min, this.times[i]);
            }
            stats.avg = funcs.round(sum / this.times.length);
            stats.total = funcs.round(stats.total);
            stats.max = funcs.round(stats.max);
            stats.min = funcs.round(stats.min);
            stats.avg = funcs.round(stats.avg);
        }
        return stats;
    };
    return State;
}());
exports["default"] = State;
//# sourceMappingURL=State.js.map
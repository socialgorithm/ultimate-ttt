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
    FreeForAllMatchmaker.prototype.getRemainingMatches = function (tournamentStats) {
        var _this = this;
        var match = [];
        this.finished = true;
        return this.players.map(function (playerA, $index) {
            return _this.players.splice($index + 1).map(function (playerB) {
                return new Match_1["default"]([playerA, playerB], {
                    maxGames: _this.options.maxGames,
                    timeout: _this.options.timeout
                });
            });
        }).reduce(function (result, current, idx) {
            return result.concat(current);
        });
    };
    return FreeForAllMatchmaker;
}());
exports["default"] = FreeForAllMatchmaker;
//# sourceMappingURL=FreeForAllMatchmaker.js.map
"use strict";
exports.__esModule = true;
var Game_1 = require("./game/Game");
var Match = (function () {
    function Match(players, options) {
        this.players = players;
        this.options = options;
        this.games = [];
        for (var i = 0; i < options.maxGames; i++) {
            this.games[i] = new Game_1["default"](this.players, { timeout: options.timeout }, { onGameStart: function () { } }, console.log);
        }
    }
    Match.prototype.playGames = function () {
        this.games.forEach(function (game) {
            game.playGame();
        });
    };
    return Match;
}());
exports["default"] = Match;
//# sourceMappingURL=Match.js.map
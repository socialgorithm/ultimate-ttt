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
var Game_1 = require("./game/Game");
var State_1 = require("../model/State");
var events_1 = require("../../events");
var Subscriber_1 = require("../model/Subscriber");
var Match = (function (_super) {
    __extends(Match, _super);
    function Match(tournmentId, players, options) {
        var _this = _super.call(this) || this;
        _this.tournmentId = tournmentId;
        _this.players = players;
        _this.options = options;
        _this.games = [];
        _this.stats = new State_1["default"]();
        _this.matchID = uuid();
        for (var i = 0; i < options.maxGames; i++) {
            _this.games[i] = new Game_1["default"](_this.matchID, _this.players, {
                timeout: options.timeout,
                gameId: i
            }, {
                onGameStart: function () { }
            }, console.log);
        }
        _this.subscribeNamespaced(_this.matchID, events_1.GAME_END, _this.onGameEnd);
        return _this;
    }
    Match.prototype.start = function () {
        this.stats.state = 'playing';
        this.playNextGame();
    };
    Match.prototype.playNextGame = function () {
        var game = this.games[this.stats.games];
        if (!game) {
            console.error('Invalid game!', this);
            this.onMatchEnd();
            return;
        }
        game.start();
    };
    Match.prototype.onGameEnd = function (game) {
        this.stats.times.push(game.gameTime);
        this.stats.games++;
        if (game.winnerIndex === -1) {
            this.stats.ties++;
        }
        else {
            this.stats.wins[game.winnerIndex]++;
        }
        if (this.stats.games >= this.games.length) {
            return this.onMatchEnd();
        }
        this.playNextGame();
    };
    Match.prototype.onMatchEnd = function () {
        this.stats.state = 'finished';
        this.publishNamespaced(this.tournmentId, events_1.MATCH_END, this);
        this.unsubscribeAll();
    };
    return Match;
}(Subscriber_1["default"]));
exports["default"] = Match;
//# sourceMappingURL=Match.js.map
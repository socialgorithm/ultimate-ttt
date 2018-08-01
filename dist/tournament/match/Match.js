"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Game_1 = require("./game/Game");
var State_1 = require("../model/State");
var uuid = require("uuid/v4");
var Match = (function () {
    function Match(players, options, sendStats) {
        this.players = players;
        this.options = options;
        this.sendStats = sendStats;
        this.uuid = uuid();
        this.games = [];
        this.stats = new State_1["default"]();
        for (var i = 0; i < options.maxGames; i++) {
            this.games[i] = new Game_1["default"](this.players, {
                timeout: options.timeout,
                gameId: i
            }, {
                onGameStart: function () { }
            }, console.log);
        }
    }
    Match.prototype.playGames = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, game;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.stats.state = 'playing';
                        _i = 0, _a = this.games;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        game = _a[_i];
                        return [4, game.playGame()];
                    case 2:
                        _b.sent();
                        this.stats.times.push(game.gameTime);
                        this.stats.games++;
                        if (game.winnerIndex === -1) {
                            this.stats.ties++;
                        }
                        else {
                            this.stats.wins[game.winnerIndex]++;
                        }
                        this.sendStats();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4:
                        this.stats.state = 'finished';
                        if (this.stats.wins[0] > this.stats.wins[1]) {
                            this.stats.winner = 0;
                        }
                        else if (this.stats.wins[1] > this.stats.wins[0]) {
                            this.stats.winner = 1;
                        }
                        return [2];
                }
            });
        });
    };
    Match.prototype.getStats = function () {
        return {
            stats: this.stats,
            players: this.players.map(function (player) { return ({
                token: player.token
            }); })
        };
    };
    Match.prototype.toString = function () {
        var winner = '';
        if (this.stats.winner > -1) {
            winner = ' [W ' + this.players[this.stats.winner].token + ']';
        }
        return 'Match ' + this.uuid + ' (' + this.players.map(function (player) { return player.token; }) + ') [' + this.stats.state + '] ' + winner;
    };
    return Match;
}());
exports["default"] = Match;
//# sourceMappingURL=Match.js.map
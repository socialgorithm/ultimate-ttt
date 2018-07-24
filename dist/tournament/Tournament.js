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
var FreeForAllMatchmaker_1 = require("./matchmaker/FreeForAllMatchmaker");
var Tournament = (function () {
    function Tournament(options, socket, players, lobbyToken) {
        var _this = this;
        this.options = options;
        this.socket = socket;
        this.players = players;
        this.lobbyToken = lobbyToken;
        this.stats = {
            started: false,
            finished: false,
            matches: []
        };
        this.sendStats = function () {
            _this.socket.emitInLobby(_this.lobbyToken, 'tournament stats', _this.getStats());
        };
        var matchOptions = {
            maxGames: this.options.numberOfGames,
            timeout: this.options.timeout
        };
        switch (options.type) {
            case 'FreeForAll':
            default:
                this.matchmaker = new FreeForAllMatchmaker_1["default"](this.players, matchOptions, this.sendStats);
                break;
        }
    }
    Tournament.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var matches;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.stats.started && !this.isFinished())) return [3, 4];
                        this.stats.started = true;
                        _a.label = 1;
                    case 1:
                        if (!!this.matchmaker.isFinished()) return [3, 3];
                        matches = this.matchmaker.getRemainingMatches(this.stats);
                        this.stats.matches = this.stats.matches.concat(matches);
                        return [4, this.playMatches(matches)];
                    case 2:
                        _a.sent();
                        this.sendStats();
                        return [3, 1];
                    case 3:
                        this.stats.finished = true;
                        this.sendStats();
                        _a.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
    Tournament.prototype.playMatches = function (matches) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, matches_1, match;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, matches_1 = matches;
                        _a.label = 1;
                    case 1:
                        if (!(_i < matches_1.length)) return [3, 4];
                        match = matches_1[_i];
                        return [4, match.playGames()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
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
}());
exports.Tournament = Tournament;
//# sourceMappingURL=Tournament.js.map
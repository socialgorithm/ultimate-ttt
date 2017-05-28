"use strict";
exports.__esModule = true;
var OnlineGame_1 = require("./OnlineGame");
var Session_1 = require("./Session");
var TournamentProfile = (function () {
    function TournamentProfile(tournament, player) {
        this.tournament = tournament;
        this.player = player;
        this.complete = false;
    }
    TournamentProfile.prototype.startPlaying = function (other) {
        this.played.push(other.player.token);
        this.opponent = other;
    };
    TournamentProfile.prototype.stopPlaying = function () {
        this.opponent = undefined;
    };
    TournamentProfile.prototype.isPlaying = function () {
        return this.opponent === undefined;
    };
    TournamentProfile.prototype.currentOpponent = function () {
        return this.opponent;
    };
    TournamentProfile.prototype.isPlayable = function () {
        return !this.complete && this.opponent === undefined && this.player.alive();
    };
    TournamentProfile.prototype.canPlayGivenProfile = function (other) {
        return this.isPlayable() && other.isPlayable() && this.played.indexOf(other.player.token) < 0;
    };
    TournamentProfile.prototype.markAsComplete = function () {
        this.complete = true;
    };
    return TournamentProfile;
}());
exports.TournamentProfile = TournamentProfile;
var Tournament = (function () {
    function Tournament(name, socketServer, participants, ui) {
        var _this = this;
        this.name = name;
        this.socketServer = socketServer;
        this.participants = participants;
        this.ui = ui;
        this.profiles = this.participants.map(function (p) { return new TournamentProfile(_this, p); });
        this.complete = 0;
        this.flush();
    }
    Tournament.prototype.endSession = function (session) {
        var _this = this;
        session.players.forEach(function (player) {
            var profile = _this.profileByPlayer(player);
            profile.stopPlaying();
        });
        this.flush();
    };
    Tournament.prototype.isFinished = function () {
        return this.complete === this.profiles.length;
    };
    Tournament.prototype.profileByPlayer = function (player) {
        return this.profiles.filter(function (p) { return p.player.token === player.token; })[0];
    };
    Tournament.prototype.startSession = function (session, settings) {
        if (settings === void 0) { settings = {}; }
        this.socketServer.emitPayload('stats', 'session-start', { players: session.playerTokens() });
        var game = new OnlineGame_1["default"](session, this.socketServer, this.ui, settings);
        session.players.forEach(function (player) {
            player.session = session;
        });
        session.players.forEach(function (player) {
            player.socket.on('disconnect', function () {
                game.handleGameEnd(player.otherPlayerInSession(), true);
            });
            player.socket.on('game', game.handlePlayerMove(player));
        });
        game.playGame();
    };
    Tournament.prototype.flush = function () {
        for (var _i = 0, _a = this.profiles; _i < _a.length; _i++) {
            var profile = _a[_i];
            if (!profile.isPlaying()) {
                for (var _b = 0, _c = this.profiles; _b < _c.length; _b++) {
                    var other = _c[_b];
                    if (profile.canPlayGivenProfile(other)) {
                        profile.startPlaying(other);
                        other.startPlaying(profile);
                    }
                }
                if (!profile.isPlaying()) {
                    profile.markAsComplete();
                    this.playerIsDone(profile);
                    this.complete++;
                }
                else {
                    var session = new Session_1["default"]([profile.player, profile.currentOpponent().player]);
                    this.startSession(session);
                }
            }
        }
    };
    Tournament.prototype.playerIsDone = function (profile) {
    };
    return Tournament;
}());
exports.Tournament = Tournament;
//# sourceMappingURL=Tournament.js.map
"use strict";
exports.__esModule = true;
var randomWord = require("random-word");
var Lobby = (function () {
    function Lobby(admin) {
        this.admin = admin;
        this.players = [];
        this.bannedPlayers = [];
        this.token = randomWord() + "-" + randomWord();
    }
    Lobby.prototype.toObject = function () {
        return {
            token: this.token,
            players: this.players.map(function (player) { return ({
                token: player.token
            }); }),
            tournament: this.tournament ? this.tournament.getStats() : null
        };
    };
    return Lobby;
}());
exports.Lobby = Lobby;
//# sourceMappingURL=Lobby.js.map
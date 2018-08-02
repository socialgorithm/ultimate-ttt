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
            players: this.players.map(function (player) { return ({
                token: player.token
            }); }),
            token: this.token,
            tournament: this.tournament ? this.tournament.getStats() : null
        };
    };
    return Lobby;
}());
exports.Lobby = Lobby;
//# sourceMappingURL=Lobby.js.map
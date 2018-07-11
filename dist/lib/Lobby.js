"use strict";
exports.__esModule = true;
var randomWord = require("random-word");
var Lobby = (function () {
    function Lobby(admin) {
        this.admin = admin;
        this.players = [];
        this.token = randomWord() + "-" + randomWord();
    }
    Lobby.prototype.toObject = function () {
        return JSON.parse(JSON.stringify(this, function (key, value) {
            if (key === 'socket' || key === 'admin') {
                return null;
            }
            return value;
        }));
    };
    return Lobby;
}());
exports.Lobby = Lobby;
//# sourceMappingURL=Lobby.js.map
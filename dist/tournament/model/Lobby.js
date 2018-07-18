"use strict";
exports.__esModule = true;
var randomWord = require("random-word");
var circularJson = require("circular-json");
var Lobby = (function () {
    function Lobby(admin) {
        this.admin = admin;
        this.players = [];
        this.token = randomWord() + "-" + randomWord();
    }
    Lobby.prototype.toObject = function () {
        return circularJson.stringify(this, function (key, value) {
            if (key === 'admin' || key === 'socket') {
                return null;
            }
            return value;
        });
    };
    return Lobby;
}());
exports.Lobby = Lobby;
//# sourceMappingURL=Lobby.js.map
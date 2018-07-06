"use strict";
exports.__esModule = true;
var randomWord = require("random-word");
var Lobby = (function () {
    function Lobby(admin) {
        this.admin = admin;
        this.players = [];
        this.token = randomWord() + "-" + randomWord();
    }
    return Lobby;
}());
exports.Lobby = Lobby;
//# sourceMappingURL=Lobby.js.map
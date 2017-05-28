"use strict";
exports.__esModule = true;
var Session = (function () {
    function Session(players) {
        this.players = players;
    }
    Session.prototype.playerTokens = function () {
        return this.players.map(function (p) { return p.token; });
    };
    return Session;
}());
exports["default"] = Session;
//# sourceMappingURL=Session.js.map
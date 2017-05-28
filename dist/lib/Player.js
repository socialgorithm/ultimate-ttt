"use strict";
exports.__esModule = true;
var Player = (function () {
    function Player(token, socket) {
        this.token = token;
        this.socket = socket;
    }
    Player.prototype.getIndexInSession = function () {
        return this.session.players.indexOf(this);
    };
    Player.prototype.deliverAction = function (action) {
        console.log("emitting " + action + " to " + this.token);
        this.socket.emit('game', { action: action });
    };
    Player.prototype.otherPlayerInSession = function () {
        return this.session.players[1 - this.getIndexInSession()];
    };
    return Player;
}());
exports["default"] = Player;
//# sourceMappingURL=Player.js.map
"use strict";
exports.__esModule = true;
var PlayerImpl = (function () {
    function PlayerImpl(token, socket) {
        this.token = token;
        this.socket = socket;
    }
    PlayerImpl.prototype.getIndexInSession = function () {
        return this.session.players.indexOf(this);
    };
    PlayerImpl.prototype.deliverAction = function (action) {
        console.log("emitting " + action + " to " + this.token);
        this.socket.emit('game', { action: action });
    };
    PlayerImpl.prototype.otherPlayerInSession = function () {
        return this.session.players[1 - this.getIndexInSession()];
    };
    PlayerImpl.prototype.alive = function () {
        return this.socket.connected;
    };
    return PlayerImpl;
}());
exports.PlayerImpl = PlayerImpl;
//# sourceMappingURL=Player.js.map
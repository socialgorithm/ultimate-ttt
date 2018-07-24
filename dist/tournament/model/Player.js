"use strict";
exports.__esModule = true;
var Player = (function () {
    function Player(token, channel) {
        this.token = token;
        this.channel = channel;
    }
    Player.prototype.alive = function () {
        return this.channel.isConnected();
    };
    return Player;
}());
exports["default"] = Player;
//# sourceMappingURL=Player.js.map
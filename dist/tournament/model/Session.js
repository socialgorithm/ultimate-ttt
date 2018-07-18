"use strict";
exports.__esModule = true;
var Session = (function () {
    function Session(players) {
        this.players = players;
        this.handlers = [];
    }
    Session.prototype.playerTokens = function () {
        return this.players.map(function (p) { return p.token; });
    };
    Session.prototype.registerHandler = function (index, type, handler) {
        this.handlers.push([index, type, handler]);
        this.players[index].socket.on(type, handler);
    };
    Session.prototype.terminate = function () {
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var _b = _a[_i], index = _b[0], type = _b[1], handler = _b[2];
            this.players[index].socket.removeListener(type, handler);
        }
    };
    return Session;
}());
exports["default"] = Session;
//# sourceMappingURL=Session.js.map
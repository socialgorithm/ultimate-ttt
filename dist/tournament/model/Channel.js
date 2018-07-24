"use strict";
exports.__esModule = true;
var Channel = (function () {
    function Channel(socket) {
        this.socket = socket;
        this.handlers = [];
    }
    Channel.prototype.registerHandler = function (type, handler) {
        this.handlers.push([type, handler]);
        this.socket.on(type, handler);
    };
    Channel.prototype.removeAllHandlers = function () {
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var _b = _a[_i], type = _b[0], handler = _b[1];
            this.socket.removeListener(type, handler);
        }
    };
    Channel.prototype.send = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        (_a = this.socket).emit.apply(_a, [type].concat(args));
    };
    Channel.prototype.isConnected = function () {
        return this.socket.connected;
    };
    Channel.prototype.disconnect = function () {
        this.socket.disconnect();
    };
    return Channel;
}());
exports["default"] = Channel;
//# sourceMappingURL=Channel.js.map
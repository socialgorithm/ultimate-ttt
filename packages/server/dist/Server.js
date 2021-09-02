"use strict";
exports.__esModule = true;
var game_server_1 = require("@socialgorithm/game-server");
var debug = require("debug")("sg:uttt");
var UTTTMatch_1 = require("./UTTTMatch");
var Server = (function () {
    function Server(options) {
        var port = process.env.PORT ? parseInt(process.env.PORT, 10) : options.port || 5433;
        this.gameServer = new game_server_1["default"]({ name: "Ultimate Tic Tac Toe" }, this.newMatchFunction, { port: port });
    }
    Server.prototype.newMatchFunction = function (createMatchMessage, outputChannel) {
        return new UTTTMatch_1["default"](createMatchMessage.options, createMatchMessage.players, outputChannel);
    };
    return Server;
}());
exports["default"] = Server;
//# sourceMappingURL=Server.js.map
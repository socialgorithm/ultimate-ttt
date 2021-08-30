"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_server_1 = require("@socialgorithm/game-server");
const debug = require("debug")("sg:uttt");
const UTTTMatch_1 = require("./UTTTMatch");
class Server {
    constructor(options) {
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : options.port || 5433;
        this.gameServer = new game_server_1.default({ name: "Ultimate Tic Tac Toe" }, this.newMatchFunction, { port });
    }
    newMatchFunction(createMatchMessage, outputChannel) {
        return new UTTTMatch_1.default(createMatchMessage.options, createMatchMessage.players, outputChannel);
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map
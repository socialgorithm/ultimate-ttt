"use strict";
exports.__esModule = true;
var OnlineServer_1 = require("./lib/OnlineServer");
exports["default"] = function (options) {
    options.host = process.env.HOST || options.host || 'localhost';
    options.port = process.env.PORT || options.port || 3141;
    options.games = process.env.TTT_GAMES || options.games;
    options.timeout = process.env.TTT_TIMEOUT || options.timeout;
    new OnlineServer_1["default"](options);
};
//# sourceMappingURL=index.js.map
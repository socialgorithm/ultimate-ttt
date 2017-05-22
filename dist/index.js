"use strict";
exports.__esModule = true;
var local_1 = require("./lib/local");
var OnlineServer_1 = require("./lib/OnlineServer");
function server(options) {
    options.host = process.env.HOST || options.host || 'localhost';
    options.port = process.env.PORT || options.port;
    options.games = process.env.TTT_GAMES || options.games;
    options.timeout = process.env.TTT_TIMEOUT || options.timeout;
    if (options.local) {
        local_1["default"](options);
    }
    else if (options.a || options.b) {
        console.error('Error: Player files may only be specified for local games (use --local with -a and -b)');
    }
    else {
        new OnlineServer_1["default"](options);
    }
}
exports["default"] = server;
//# sourceMappingURL=index.js.map
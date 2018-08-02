"use strict";
exports.__esModule = true;
var commandLineArgs = require("command-line-args");
var getUsage = require("command-line-usage");
var info = require("../../package.json");
exports.DEFAULT_OPTIONS = {
    port: parseInt(process.env.PORT, 10) || 3141
};
var optionDefinitions = [
    {
        description: "The input to process.",
        name: "verbose",
        type: Boolean
    },
    {
        alias: "v",
        description: "Display the server version",
        name: "version",
        type: Boolean
    },
    {
        alias: "p",
        defaultValue: exports.DEFAULT_OPTIONS.port,
        description: "Port on which the server should be started (defaults to 3141)",
        name: "port",
        type: Number,
        typeLabel: "[underline]{3141}"
    },
    {
        alias: "h",
        description: "Print this guide",
        name: "help",
        type: Boolean
    },
];
var sections = [
    {
        content: "Ultimate Tic Tac Toe - Game Server",
        header: "uttt"
    },
    {
        header: "Options",
        optionList: optionDefinitions
    },
    {
        content: [
            "$ uttt --games 100",
            "$ uttt --port 5000",
            "$ uttt [bold]{--help}",
        ],
        header: "Synopsis"
    },
];
exports["default"] = (function () {
    var options = commandLineArgs(optionDefinitions);
    Object.keys(options).map(function (key) {
        if (options[key] === null) {
            options[key] = true;
        }
    });
    if (options.version) {
        console.log(info.version);
        process.exit(0);
    }
    if (options.help) {
        console.log(getUsage(sections));
        process.exit(0);
    }
    if (options.port) {
        options.port = parseInt(options.port, 10);
    }
    options.host = options.host || "localhost";
    options.port = options.port || 3141;
    return options;
});
//# sourceMappingURL=cli-options.js.map
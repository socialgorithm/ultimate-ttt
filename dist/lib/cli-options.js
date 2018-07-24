"use strict";
exports.__esModule = true;
var commandLineArgs = require('command-line-args');
var getUsage = require('command-line-usage');
var info = require('../../package.json');
exports.DEFAULT_OPTIONS = {
    port: parseInt(process.env.PORT, 10) || 3141
};
var optionDefinitions = [
    {
        name: 'verbose',
        type: Boolean,
        description: 'The input to process.'
    },
    {
        name: 'version',
        alias: 'v',
        type: Boolean,
        description: 'Display the server version'
    },
    {
        name: 'port',
        alias: 'p',
        type: Number,
        defaultValue: exports.DEFAULT_OPTIONS.port,
        typeLabel: '[underline]{3141}',
        description: 'Port on which the server should be started (defaults to 3141)'
    },
    {
        name: 'gui',
        alias: 'u',
        type: Boolean,
        description: 'Display a fancy GUI in the terminal (only available in online mode)'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print this guide'
    }
];
var sections = [
    {
        header: 'uttt',
        content: 'Ultimate Tic Tac Toe - Game Server'
    },
    {
        header: 'Options',
        optionList: optionDefinitions
    },
    {
        header: 'Synopsis',
        content: [
            '$ uttt --gui',
            '$ uttt --games 100',
            '$ uttt --port 5000',
            '$ uttt [bold]{--help}'
        ]
    }
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
    options.host = options.host || 'localhost';
    options.port = options.port || 3141;
    return options;
});
//# sourceMappingURL=cli-options.js.map
"use strict";
exports.__esModule = true;
var commandLineArgs = require('command-line-args');
var getUsage = require('command-line-usage');
var info = require('../../package.json');
var optionDefinitions = [
    {
        name: 'verbose',
        description: 'The input to process.'
    },
    {
        name: 'version',
        alias: 'v',
        description: 'Display the server version'
    },
    {
        name: 'port',
        alias: 'p',
        typeLabel: '[underline]{3141}',
        description: 'Port on which the server should be started (defaults to 3141)'
    },
    {
        name: 'gui',
        alias: 'u',
        description: 'Display a fancy GUI in the terminal (only available in online mode)'
    },
    {
        name: 'games',
        alias: 'g',
        typeLabel: '[underline]{1000}',
        description: 'Number of games to play, defaults to 1000'
    },
    {
        name: 'timeout',
        alias: 't',
        typeLabel: '[underline]{100}',
        description: 'Milliseconds after which a player loses (defaults to 100)'
    },
    {
        name: 'help',
        alias: 'h',
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
exports["default"] = function () {
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
    return options;
};
//# sourceMappingURL=input.js.map
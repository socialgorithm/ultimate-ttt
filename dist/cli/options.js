"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commandLineArgs = require("command-line-args");
const getUsage = require("command-line-usage");
const info = require("../../package.json");
exports.DEFAULT_OPTIONS = {
    port: parseInt(process.env.PORT, 10) || 5433,
};
const optionDefinitions = [
    {
        alias: "p",
        defaultValue: exports.DEFAULT_OPTIONS.port,
        description: "Port on which the server should be started (defaults to 5433)",
        name: "port",
        type: Number,
        typeLabel: "{underline 5433}",
    },
    {
        alias: "h",
        description: "Print this guide",
        name: "help",
        type: Boolean,
    },
];
const sections = [
    {
        header: `${info.name} v${info.version}`,
        content: info.description,
    },
    {
        header: "Options",
        optionList: optionDefinitions,
    },
    {
        header: "Synopsis",
        content: [
            `$ ${info.name} {bold --port} {underline 5433}`,
            `$ ${info.name} {bold --help}`,
        ],
    },
];
exports.default = () => {
    const options = commandLineArgs(optionDefinitions);
    Object.keys(options).map((key) => {
        if (options[key] === null) {
            options[key] = true;
        }
    });
    if (options.help) {
        console.log(getUsage(sections));
        process.exit(0);
    }
    if (options.port) {
        options.port = parseInt(options.port, 10);
    }
    options.port = options.port || 5433;
    return options;
};
//# sourceMappingURL=options.js.map
import * as commandLineArgs from "command-line-args";
import * as getUsage from "command-line-usage";

// tslint:disable-next-line:no-var-requires
const info = require("./calls.json");

/**
 * Server Options
 * If launching from the terminal these options can be set as `--{option name}[ value]`
 */
export interface IOptions {
  version?: boolean;
  verbose?: boolean;
  port?: number;
  host?: string;
  help?: number;
}

export const DEFAULT_OPTIONS: IOptions = {
  port: parseInt(process.env.PORT, 10) || 3141,
};

const optionDefinitions = [
  {
    description: "The input to process.",
    name: "verbose",
    type: Boolean,
  },
  {
    alias: "v",
    description: "Display the server version",
    name: "version",
    type: Boolean,
  },
  {
    alias: "p",
    defaultValue: DEFAULT_OPTIONS.port,
    description: "Port on which the server should be started (defaults to 3141)",
    name: "port",
    type: Number,
    typeLabel: "[underline]{3141}",
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
    content: "Ultimate Tic Tac Toe - Game Server",
    header: "uttt",
  },
  {
    header: "Options",
    optionList: optionDefinitions,
  },
  {
    content: [
      "$ uttt --games 100",
      "$ uttt --port 5000",
      "$ uttt [bold]{--help}",
    ],
    header: "Synopsis",
  },
];

// ------------------------------------------- //

/**
 * Parse the options from the command line and then return the options object
 * @returns {any}
 */
export default (): IOptions => {
  const options: any = commandLineArgs(optionDefinitions);

  Object.keys(options).map((key: string) => {
    if (options[key] === null) {
      options[key] = true;
    }
  });

  if (options.version) {
    // tslint:disable-next-line:no-console
    console.log(info.version);
    process.exit(0);
  }

  if (options.help) {
    // tslint:disable-next-line:no-console
    console.log(getUsage(sections));
    process.exit(0);
  }

  if (options.port) {
    options.port = parseInt(options.port, 10);
  }

  // defaults
  options.host = options.host || "localhost";
  options.port = options.port || 3141;

  return options;
};

// ------------------------------------------- //

import * as commandLineArgs from "command-line-args";
import * as getUsage from "command-line-usage";

// tslint:disable-next-line:no-var-requires
const info = require("../../package.json");

/**
 * Server Options
 * If launching from the terminal these options can be set as `--{option name}[ value]`
 */
export type ServerOptions = {
  port?: number;
  help?: number;
};

export const DEFAULT_OPTIONS: ServerOptions = {
  port: parseInt(process.env.PORT, 10) || 5433,
};

const optionDefinitions = [
  {
    alias: "p",
    defaultValue: DEFAULT_OPTIONS.port,
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
    // tslint:disable-next-line:object-literal-sort-keys
    content: info.description,
  },
  {
    header: "Options",
    optionList: optionDefinitions,
  },
  {
    header: "Synopsis",
    // tslint:disable-next-line:object-literal-sort-keys
    content: [
      `$ ${info.name} {bold --port} {underline 5433}`,
      `$ ${info.name} {bold --help}`,
    ],
  },
];

// ------------------------------------------- //

/**
 * Parse the options from the command line and then return the options object
 * @returns {any}
 */
export default (): ServerOptions => {
  const options: any = commandLineArgs(optionDefinitions);

  Object.keys(options).map((key: string) => {
    if (options[key] === null) {
      options[key] = true;
    }
  });

  if (options.help) {
    // tslint:disable-next-line:no-console
    console.log(getUsage(sections));
    process.exit(0);
  }

  if (options.port) {
    options.port = parseInt(options.port, 10);
  }

  // defaults
  options.port = options.port || 5433;

  return options;
};

// ------------------------------------------- //

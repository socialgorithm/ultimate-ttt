const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const info = require('../../package.json');

/**
 * Server Options
 * If launching from the terminal these options can be set as `--{option name}[ value]`
 */
export interface Options {
  version?: boolean;
  verbose?: boolean;
  port?: number;
  gui?: boolean;
  host?: string;
  games?: number;
  timeout?: number;
  help?: number;
}

export const DEFAULT_OPTIONS: Options = {
  port: process.env.PORT || 3141,
  timeout: process.env.TTT_TIMEOUT || 100,
  games: process.env.TTT_GAMES || 100,
};

const optionDefinitions = [
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
    defaultValue: DEFAULT_OPTIONS.port,
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
    name: 'games',
    alias: 'g',
    type: Number,
    defaultValue: DEFAULT_OPTIONS.games,
    typeLabel: '[underline]{100}',
    description: 'Number of games to play, defaults to 100'
  },
  {
    name: 'timeout',
    alias: 't',
    type: Number,
    defaultValue: DEFAULT_OPTIONS.timeout,
    typeLabel: '[underline]{100}',
    description: 'Milliseconds after which a player loses (defaults to 100)'
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Print this guide'
  }
];

const sections = [
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

// ------------------------------------------- //

/**
 * Parse the options from the command line and then return the options object
 * @returns {any}
 */
export default (): Options => {
  const options = commandLineArgs(optionDefinitions);

  Object.keys(options).map((key: string) => {
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

  // defaults
  options.host = options.host || 'localhost';
  options.port = options.port || 3141;

  return options;
}

// ------------------------------------------- //
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const info = require('../../package.json');

export interface Options {
  version?: boolean;
  verbose?: boolean;
  port?: string;
  gui?: boolean;
  local?: boolean;
  host?: string;
  a?: string;
  b?: string;
  games?: string;
  timeout?: string;
  help?: number;
}

const optionDefinitions = [
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
    name: 'local',
    alias: 'l',
    description: 'Play games locally executing the players code directly (not recommended)'
  },
  {
    name: 'a',
    alias: 'a',
    typeLabel: '[underline]{file}',
    description: 'Client 1 for the algorithm competition (for local games only)'
  },
  {
    name: 'b',
    alias: 'b',
    typeLabel: '[underline]{file}',
    description: 'Client 2 for the algorithm competition (for local games only)'
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
      '$ uttt --local [bold]{-a} [underline]{path/to/programOne} [bold]{-b} [underline]{path/to/programTwo}',
      '$ uttt [bold]{--help}'
    ]
  }
];

// ------------------------------------------- //

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

  return options;
}

// ------------------------------------------- //
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const info = require('../package.json');

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
    name: 'a',
    alias: 'a',
    typeLabel: '[underline]{file}',
    description: 'Client 1 for the algorithm competition'
  },
  {
    name: 'b',
    alias: 'b',
    typeLabel: '[underline]{file}',
    description: 'Client 2 for the algorithm competition'
  },
  {
    name: 'games',
    alias: 'g',
    typeLabel: '[underline]{1000}',
    description: 'Number of games to play, defaults to 1000'
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
    content: 'Ultimate Tic Tac Toe - Game Server. If you prefer running it as a server use `$ npm start` instead.'
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  },
  {
    header: 'Synopsis',
    content: [
      '$ uttt [bold]{-a} [underline]{path/to/programOne} [bold]{-b} [underline]{path/to/programTwo}',
      '$ uttt [bold]{--help}'
    ]
  }
];

// ------------------------------------------- //

function parseInput() {
  const options = commandLineArgs(optionDefinitions);

  function isEmpty(map) {
    for(let key in map) {
      return !map.hasOwnProperty(key);
    }
    return true;
  }

  if (options.version) {
    console.log(info.version);
    process.exit(0);
  }

  if (options.help || isEmpty(options) || !options.a || !options.b) {
    console.log(getUsage(sections));
    process.exit(0);
  }

  return options;
}

module.exports = parseInput;

// ------------------------------------------- //
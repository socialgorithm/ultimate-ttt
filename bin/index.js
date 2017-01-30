#!/usr/bin/env node

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

const options = commandLineArgs(optionDefinitions);

function isEmpty(map) {
  for(let key in map) {
    return !map.hasOwnProperty(key);
  }
  return true;
}

if (options.version) {
  console.log(info.version);
  return;
}

if (options.help || isEmpty(options) || !options.a || !options.b) {
  console.log(getUsage(sections));
  return;
}

// ------------------------------------------- //

const resolve = require('path').resolve;

function loadPlayer(path) {
  try{
    const name = resolve(path);
    return require.main.require(name);
  }catch(e){
    if (e.code === 'MODULE_NOT_FOUND' && e.message.indexOf(name) !== -1) {
      console.warn('Cannot find player "%s".\n  Did you forget to install it?\n', name);
    } else {
      console.warn('Error during loading "%s" player:\n  %s', name, e.message);
    }
    return false;
  }
}

function validatePlayer(Player){
  if(!Player || typeof(Player) !== 'function'){
    throw new Error('Invalid player object');
  }

  const testPlayer = new Player();

  if(typeof(testPlayer.move) === 'undefined'){
    throw new Error('Player is missing the move method');
  }
}

console.info('Ultimate Tic Tac Toe');

console.log('');

const player = [];
player.push(loadPlayer(options.a));
player.push(loadPlayer(options.b));

try{
  validatePlayer(player[0]);
}catch(e){
  console.error('Player 1 is invalid.', e);
  return;
}

try{
  validatePlayer(player[1]);
}catch(e){
  console.error('Player 2 is invalid.', e);
  return;
}

// ------------------------------------------- //

const UTTT = require('ultimate-ttt');

console.info("Starting game!");

const game = new UTTT();

console.log(game.prettyPrint());
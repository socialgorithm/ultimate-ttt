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

function loadPlayer(path, player) {
  try{
    const name = resolve(path);
    const Player = require.main.require(name);
    return new Player(player);
  }catch(e){
    if (e.code === 'MODULE_NOT_FOUND' && e.message.indexOf(name) !== -1) {
      console.warn('Cannot find player "%s".\n  Did you forget to install it?\n', name);
    } else {
      console.warn('Error during loading "%s" player:\n  %s', name, e.message);
    }
    return false;
  }
}

function validatePlayer(player){
  if(!player || typeof(player) !== 'object'){
    throw new Error('Invalid player object');
  }

  if(typeof(player.getMove) !== 'function'){
    throw new Error('Player is missing the move method');
  }
}

console.info('Ultimate Tic Tac Toe');

console.log('');

const player = [];
player.push(loadPlayer(options.a, 1));
player.push(loadPlayer(options.b, 2));

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

let currentPlayer = 0;
let iterations = 0;
try {
  while (!game.isFinished()) {
    const nextStep = player[currentPlayer].getMove();
    const playerNumber = currentPlayer + 1;

    game.move(
      nextStep.board,
      playerNumber,
      nextStep.move
    );
    player[currentPlayer].addMove(nextStep.board, nextStep.move);

    currentPlayer = 1 - currentPlayer;

    player[currentPlayer].addOponentMove(nextStep.board, nextStep.move);
    iterations++;

    if (iterations > 100) {
      console.log('Limit reached');
      console.log(game.prettyPrint());
      return;
    }
  }
}catch(e){
  console.log(game.prettyPrint());
  console.error('Error during game, played %s iterations', iterations, e);
  return;
}

console.log('Game Finished!');
console.log('Winner: Player ' + game.winner);
console.log('Moves: ' + game.moves);

console.log('');

console.log(game.prettyPrint());

console.log('');

console.log(game.stateBoard.prettyPrint());
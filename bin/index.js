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

function validateMethod(player, method){
  if(typeof(player[method]) !== 'function'){
    throw new Error(`Player is missing the ${method}() method`);
  }
}

function validatePlayer(player){
  if(!player || typeof(player) !== 'object'){
    throw new Error('Invalid player object');
  }

  validateMethod(player, 'init');
  validateMethod(player, 'getMove');
  validateMethod(player, 'addMove');
  validateMethod(player, 'addOponentMove');
}

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
const tripwire = require('tripwire');

console.info("+----------------------------------+");
console.info("|   Ultimate TTT Algorithm Fight   |");
console.info("+----------------------------------+");

const timeout = 100;
const games = 1000;

const state = {
  games: 0,
  ties: 0,
  wins: [
    0,
    0
  ],
  times: [],
  timeouts: [
    0,
    0
  ]
};

let currentPlayer;

function round(time){
  return Math.round(time * 100) / 100;
}

function convertExecTime(nanosecs){
  return round(nanosecs/1000000);
}

function getPercentage(num, total){
  if(total < 1){
    return '0%';
  }
  return (num * 100 / total) + '%';
}

function printState(){
  // Get winner
  let winner = -1;
  if(state.wins[0] === state.wins[1]){
    winner = 0;
  }else if(state.wins[0] > state.wins[1]){
    winner = 1;
  }else{
    winner = 2;
  }

  // Get avg exec time
  let sum = 0;
  let total = 0;
  let max = 0;
  let avg = 0;
  let min = 1000;
  if(state.times.length > 0){
    for(let i = 0; i < state.times.length; i++ ){
      total += state.times[i];
      sum += state.times[i];
      max = Math.max(max, state.times[i]);
      min = Math.min(min, state.times[i]);
    }
    avg = sum/state.times.length;
  }

  console.log('');
  console.log('Games played: %d', state.games);
  console.log('Winner: %d', winner);
  console.log('');
  console.log('Player 1 wins: %d (%s)', state.wins[0], getPercentage(state.wins[0], state.games));
  console.log('Player 2 wins: %d (%s)', state.wins[1], getPercentage(state.wins[1], state.games));
  console.log('Ties: %d (%s)', state.ties, getPercentage(state.ties, state.games));
  console.log('');
  console.log('Player 1 timeouts: %d', state.timeouts[0]);
  console.log('Player 2 timeouts: %d', state.timeouts[1]);
  console.log('');
  console.log('Total time: %dms', round(total));
  console.log('Avg game: %dms', round(avg));
  console.log('Max game: %dms', round(max));
  console.log('Min game: %dms', round(min));
}

// Setup timeout processor
process.on('uncaughtException', function (e) {
  state.wins[1 - currentPlayer]++;
  state.timeouts[currentPlayer]++;

  console.log('Player %d timed out', currentPlayer + 1);

  printState();
});

while(state.games < games){
  const hrstart = process.hrtime();
  let iterations = 0;
  currentPlayer = 0;

  player[0].init();
  player[1].init();

  state.games++;

  const game = new UTTT();

  try {
    while (!game.isFinished()) {
      tripwire.resetTripwire(timeout);

      const nextStep = player[currentPlayer].getMove();
      const playerNumber = currentPlayer + 1;

      game.move(
        nextStep.board,
        playerNumber,
        nextStep.move
      );
      player[currentPlayer].addMove(nextStep.board, nextStep.move);

      currentPlayer = 1 - currentPlayer;

      player[currentPlayer].addOpponentMove(nextStep.board, nextStep.move);
      iterations++;

      if (iterations > 100) {
        console.error('Limit reached');
        console.error(game.prettyPrint());
        return;
      }
    }

    // Store winner
    if(game.winner > 0){
      state.wins[game.winner - 1]++;
    }else{
      state.ties++;
    }
  }catch(e){
    state.wins[1 - currentPlayer]++;
  }finally{
    tripwire.clearTripwire();
    const hrend = process.hrtime(hrstart);
    state.times.push(convertExecTime(hrend[1]));
  }
}

printState();
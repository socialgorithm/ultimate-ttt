#!/usr/bin/env node

const UTTT = require('ultimate-ttt');
const tripwire = require('tripwire');

const funcs = require('../lib/funcs');

// Parse cli input
const options = require('../lib/input')();

const player = [];
player.push(funcs.loadPlayer(options.a, 1));
player.push(funcs.loadPlayer(options.b, 2));

try{
  funcs.validatePlayer(player[0]);
}catch(e){
  console.error('Player 1 is invalid.', e);
  return;
}

try{
  funcs.validatePlayer(player[1]);
}catch(e){
  console.error('Player 2 is invalid.', e);
  return;
}

// ------------------------------------------- //

console.info("+-----------------------------------+");
console.info("|   Ultimate TTT Algorithm Battle   |");
console.info("+-----------------------------------+");

const timeout = 100;
const games = options.games || 1000;

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

// Setup timeout processor
process.on('uncaughtException', function (e) {
  state.wins[1 - currentPlayer]++;
  state.timeouts[currentPlayer]++;

  console.log('Player %d timed out', currentPlayer + 1);

  funcs.printState(state);
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
    state.times.push(funcs.convertExecTime(hrend[1]));
  }
}

funcs.printState(state);
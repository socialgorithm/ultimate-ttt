const resolve = require('path').resolve;

function loadPlayer(path, player) {
  try{
    const name = resolve(path);
    const Player = require.main.require(name);
    return new Player(player);
  }catch(e){
    if (e.code === 'MODULE_NOT_FOUND' && e.message.indexOf(path) !== -1) {
      console.warn('Cannot find player "%s".\n  Did you forget to install it?\n', path);
    } else {
      console.warn('Error during loading "%s" player:\n  %s', path, e.message);
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
  validateMethod(player, 'addOpponentMove');
}

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

function printState(state){
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

module.exports = {
  loadPlayer,
  validateMethod,
  validatePlayer,
  printState,
  convertExecTime
};
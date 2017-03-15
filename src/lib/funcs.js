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
  return Math.floor(num * 100 / total) + '%';
}

function getStats(state) {
  const stats = {};
  // Get winner
  stats.winner;
  if (state.wins[0] === state.wins[1]) {
    stats.winner = -1;
  } else if(state.wins[0] > state.wins[1]) {
    stats.winner = 0;
  } else {
    stats.winner = 1;
  }

  stats.winPercentages = [
    getPercentage(state.wins[0], state.games),
    getPercentage(state.wins[1], state.games)
  ];

  stats.tiePercentage = getPercentage(state.ties, state.games);

  // Get avg exec time
  let sum = 0;
  stats.total = 0;
  stats.max = 0;
  stats.avg = 0;
  stats.min = 1000;

  if(state.times.length > 0){
    for(let i = 0; i < state.times.length; i++ ){
      stats.total += state.times[i];
      sum += state.times[i];
      stats.max = Math.max(stats.max, state.times[i]);
      stats.min = Math.min(stats.min, state.times[i]);
    }
    stats.avg = round(sum/state.times.length);
    stats.total = round(stats.total);
    stats.max = round(stats.max);
    stats.min = round(stats.min);
    stats.avg = round(stats.avg);
  }

  return stats;
}

function printState(state){
  const stats = getStats(state);

  console.log('');
  console.log('Games played: %d', state.games);
  console.log('Winner: %d', stats.winner);
  console.log('');
  console.log('Player 1 wins: %d (%s)', state.wins[0], stats.winPercentages[0]);
  console.log('Player 2 wins: %d (%s)', state.wins[1], stats.winPercentages[1]);
  console.log('Ties: %d (%s)', state.ties, stats.tiePercentage);
  console.log('');
  console.log('Player 1 timeouts: %d', state.timeouts[0]);
  console.log('Player 2 timeouts: %d', state.timeouts[1]);
  console.log('');
  console.log('Total time: %dms', stats.total);
  console.log('Avg game: %dms', stats.avg);
  console.log('Max game: %dms', stats.max);
  console.log('Min game: %dms', stats.min);
}

module.exports = {
  loadPlayer,
  validateMethod,
  validatePlayer,
  getStats,
  printState,
  convertExecTime
};
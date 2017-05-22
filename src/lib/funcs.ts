import State from "./State";
const resolve = require('path').resolve;

export function loadPlayer(path: string, player: number) {
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

export function validateMethod(player: any, method: string){
  if(typeof(player[method]) !== 'function'){
    throw new Error(`Player is missing the ${method}() method`);
  }
}

export function validatePlayer(player: any){
  if(!player || typeof(player) !== 'object'){
    throw new Error('Invalid player object');
  }

  validateMethod(player, 'init');
  validateMethod(player, 'getMove');
  validateMethod(player, 'addMove');
  validateMethod(player, 'addOpponentMove');
}

export function round(time: number): number {
  return Math.round(time * 100) / 100;
}

export function convertExecTime(nanosecs: number): number {
  return round(nanosecs/1000000);
}

export function getPercentage(num: number, total: number): string {
  if(total < 1){
    return '0%';
  }
  return Math.floor(num * 100 / total) + '%';
}
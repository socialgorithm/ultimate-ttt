import * as funcs from '../../lib/funcs';
import Game from '../match/game/Game';

/**
 * Game stats calculated from a given state
 */
export interface Stats {
  winner?: number;
  total?: number;
  max?: number;
  avg?: number;
  min?: number;
  winPercentages?: Array<string>;
  tiePercentage?: string;
}

/**
 * Games State holder
 * Used to track the state across multiple games between two players
 */
export default class State {
  public games: Game[];
  public gamesCompleted: number; // Number of games won
  public gamesTied: number; // Number of ties
  public wins: Array<number>; // Array with only two elements, 0 is wins by player 0, 1 is wins by player 1
  public times: Array<number>; // Array with the times for all the games
  public timeouts: Array<number>; // Array for all timeouts
  public state: 'playing' | 'finished' | 'upcoming';
  public winner: number; // The index (in players) of the winner of the match

  constructor() {
    this.games = [];
    this.gamesCompleted = 0;
    this.gamesTied = 0;
    this.wins = [0, 0];
    this.times = [];
    this.timeouts = [0, 0];
    this.state = 'upcoming';
    this.winner = -1;
  }

  public toJSON() {
    return {
      games: this.games,
      gamesCompleted: this.gamesCompleted,
      gamesTied: this.gamesTied,
      wins: this.wins,
      times: this.times,
      timeouts: this.timeouts,
      state: this.state,
      winner: this.winner,
    };
  }

  /**
   * Prints the current state to the console
   */
  public printState(){
    const stats = this.getStats();

    console.log('');
    console.log('Games played: %d', this.games);
    console.log('Winner: %d', stats.winner);
    console.log('');
    console.log('Player 1 wins: %d (%s)', this.wins[0], stats.winPercentages[0]);
    console.log('Player 2 wins: %d (%s)', this.wins[1], stats.winPercentages[1]);
    console.log('Ties: %d (%s)', this.gamesTied, stats.tiePercentage);
    console.log('');
    console.log('Player 1 timeouts: %d', this.timeouts[0]);
    console.log('Player 2 timeouts: %d', this.timeouts[1]);
    console.log('');
    console.log('Total time: %dms', stats.total);
    console.log('Avg game: %dms', stats.avg);
    console.log('Max game: %dms', stats.max);
    console.log('Min game: %dms', stats.min);
  }

  /**
   * Get some useful stats from the current game state
   * @returns {Stats}
   */
  public getStats(): Stats {
    const stats: Stats = {};
    // Get winner
    if (this.wins[0] === this.wins[1]) {
      stats.winner = -1;
    } else if(this.wins[0] > this.wins[1]) {
      stats.winner = 0;
    } else {
      stats.winner = 1;
    }

    stats.winPercentages = [
      funcs.getPercentage(this.wins[0], this.gamesCompleted),
      funcs.getPercentage(this.wins[1], this.gamesCompleted)
    ];

    stats.tiePercentage = funcs.getPercentage(this.gamesTied, this.gamesCompleted);

    // Get avg exec time
    let sum = 0;
    stats.total = 0;
    stats.max = 0;
    stats.avg = 0;
    stats.min = 1000;

    if(this.times.length > 0){
      for(let i = 0; i < this.times.length; i++ ){
        stats.total += this.times[i];
        sum += this.times[i];
        stats.max = Math.max(stats.max, this.times[i]);
        stats.min = Math.min(stats.min, this.times[i]);
      }
      stats.avg = funcs.round(sum/this.times.length);
      stats.total = funcs.round(stats.total);
      stats.max = funcs.round(stats.max);
      stats.min = funcs.round(stats.min);
      stats.avg = funcs.round(stats.avg);
    }

    return stats;
  }
}
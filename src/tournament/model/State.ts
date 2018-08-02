// tslint:disable:no-console

import * as funcs from "../../lib/funcs";
import { IGameStats } from "../../tournament/match/game/GameStats";

/**
 * Game stats calculated from a given state
 */
export interface IStats {
  winner?: number;
  total?: number;
  max?: number;
  avg?: number;
  min?: number;
  winPercentages?: string[];
  tiePercentage?: string;
}

/**
 * Games State holder
 * Used to track the state across multiple games between two players
 */
export default class State {
  public games: IGameStats[];
  public gamesCompleted: number; // Number of games won
  public gamesTied: number; // Number of ties
  public wins: number[]; // Array with only two elements, 0 is wins by player 0, 1 is wins by player 1
  public times: number[]; // Array with the times for all the games
  public timeouts: number[]; // Array for all timeouts
  public state: "playing" | "finished" | "upcoming";
  public winner: number; // The index (in players) of the winner of the match

  constructor() {
    this.games = [];
    this.gamesCompleted = 0;
    this.gamesTied = 0;
    this.wins = [0, 0];
    this.times = [];
    this.timeouts = [0, 0];
    this.state = "upcoming";
    this.winner = -1;
  }

  /**
   * Prints the current state to the console
   */
  public printState() {
    const stats = this.getStats();

    console.log("");
    console.log("Games played: %d", this.games);
    console.log("Winner: %d", stats.winner);
    console.log("");
    console.log("Player 1 wins: %d (%s)", this.wins[0], stats.winPercentages[0]);
    console.log("Player 2 wins: %d (%s)", this.wins[1], stats.winPercentages[1]);
    console.log("Ties: %d (%s)", this.gamesTied, stats.tiePercentage);
    console.log("");
    console.log("Player 1 timeouts: %d", this.timeouts[0]);
    console.log("Player 2 timeouts: %d", this.timeouts[1]);
    console.log("");
    console.log("Total time: %dms", stats.total);
    console.log("Avg game: %dms", stats.avg);
    console.log("Max game: %dms", stats.max);
    console.log("Min game: %dms", stats.min);
  }

  /**
   * Get some useful stats from the current game state
   * @returns {IStats}
   */
  public getStats(): IStats {
    const stats: IStats = {};
    // Get winner
    if (this.wins[0] === this.wins[1]) {
      stats.winner = -1;
    } else if (this.wins[0] > this.wins[1]) {
      stats.winner = 0;
    } else {
      stats.winner = 1;
    }

    stats.winPercentages = [
      funcs.getPercentage(this.wins[0], this.gamesCompleted),
      funcs.getPercentage(this.wins[1], this.gamesCompleted),
    ];

    stats.tiePercentage = funcs.getPercentage(this.gamesTied, this.gamesCompleted);

    // Get avg exec time
    let sum = 0;
    stats.total = 0;
    stats.max = 0;
    stats.avg = 0;
    stats.min = 1000;

    if (this.times.length > 0) {
      this.times.forEach(eachTime => {
        stats.total += eachTime;
        sum += eachTime;
        stats.max = Math.max(stats.max, eachTime);
        stats.min = Math.min(stats.min, eachTime);
      });
      stats.avg = funcs.round(sum / this.times.length);
      stats.total = funcs.round(stats.total);
      stats.max = funcs.round(stats.max);
      stats.min = funcs.round(stats.min);
      stats.avg = funcs.round(stats.avg);
    }

    return stats;
  }
}

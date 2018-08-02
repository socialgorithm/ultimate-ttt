import UTTT from "../../../../node_modules/@socialgorithm/ultimate-ttt/dist/UTTT";
import { PlayerNumber } from "../../../../node_modules/@socialgorithm/ultimate-ttt/dist/model/constants";

/**
 * A move by a player
 */
export type Move = {
  board: Array<number>,
  move: Array<number>
  player: PlayerNumber
}

/**
 * Tracks game stats, such as moves and the actual game object
 */
export type GameStats = {
  moves: Move[];
  uttt: UTTT;
}
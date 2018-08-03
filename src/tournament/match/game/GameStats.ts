import { PlayerNumber } from "../../../../node_modules/@socialgorithm/ultimate-ttt/dist/model/constants";
import UTTT from "../../../../node_modules/@socialgorithm/ultimate-ttt/dist/UTTT";

/**
 * A move by a player
 */
export interface IMove {
  board: number[];
  move: number[];
  player: PlayerNumber;
}

/**
 * Tracks game stats, such as moves and the actual game object
 */
export interface IGameStats {
  moves: IMove[];
}

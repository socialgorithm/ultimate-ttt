import { PlayerNumber } from "../../../../node_modules/@socialgorithm/ultimate-ttt/dist/model/constants";
import UTTT from "../../../../node_modules/@socialgorithm/ultimate-ttt/dist/UTTT";
export interface IMove {
    board: number[];
    move: number[];
    player: PlayerNumber;
}
export interface IGameStats {
    moves: IMove[];
    uttt: UTTT;
}

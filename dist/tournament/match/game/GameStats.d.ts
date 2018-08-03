import { PlayerNumber } from "../../../../node_modules/@socialgorithm/ultimate-ttt/dist/model/constants";
export interface IMove {
    board: number[];
    move: number[];
    player: PlayerNumber;
}
export interface IGameStats {
    moves: IMove[];
}

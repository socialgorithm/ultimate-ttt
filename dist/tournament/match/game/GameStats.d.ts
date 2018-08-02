import UTTT from "../../../../node_modules/@socialgorithm/ultimate-ttt/dist/UTTT";
import { PlayerNumber } from "../../../../node_modules/@socialgorithm/ultimate-ttt/dist/model/constants";
export declare type Move = {
    board: Array<number>;
    move: Array<number>;
    player: PlayerNumber;
};
export declare type GameStats = {
    moves: Move[];
    uttt: UTTT;
};

import Cell from './Cell';
import { Coord } from "../UTTT";
export declare const ME = 0;
export declare const OPPONENT = 1;
export declare const RESULT_TIE = -1;
export declare const RESULT_WIN = 0;
export declare const RESULT_LOSE = 1;
export default class SubBoard {
    board: Array<Array<Cell>>;
    private size;
    private maxMoves;
    winner: number;
    private moves;
    constructor(size?: number);
    isFinished(): boolean;
    getResult(): number;
    isValidMove(move: Coord): boolean;
    addMyMove(move: Coord, index?: number): SubBoard;
    addOpponentMove(move: Coord, index?: number): SubBoard;
    move(player: number, move: Coord, index?: number): SubBoard;
    prettyPrint(): string;
    copy(): SubBoard;
    private isValidPlayer(player);
    private checkRow(row);
    private checkColumn(col);
    private checkLtRDiagonal();
    private checkRtLDiagonal();
    private isFull();
}

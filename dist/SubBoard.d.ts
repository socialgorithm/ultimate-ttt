import Cell from "./Cell";
import { Coord, PlayerOrTie } from "./Constants";
import Board from "./Board";
export default class SubBoard extends Board<Cell> {
    board: Cell[][];
    constructor(size?: number);
    isFinished(): boolean;
    getResult(): number;
    isValidMove(move: Coord): boolean;
    addMyMove(move: Coord, index?: number): SubBoard;
    addOpponentMove(move: Coord, index?: number): SubBoard;
    move(player: PlayerOrTie, move: Coord, allowTies?: boolean, index?: number): SubBoard;
    getValidMoves(): Coord[];
    prettyPrint(printTies?: boolean): string;
    copy(): SubBoard;
    isFull(): boolean;
    private isValidPlayer;
    private checkRow;
    private checkColumn;
    private checkLtRDiagonal;
    private checkRtLDiagonal;
}

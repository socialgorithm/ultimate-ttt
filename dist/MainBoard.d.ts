import SubBoard from "./SubBoard";
import { Coord } from "./Constants";
import Board from "./Board";
export default class MainBoard extends Board<SubBoard> {
    board: SubBoard[][];
    stateBoard: SubBoard;
    constructor(size?: number);
    isFinished(): boolean;
    getResult(): number;
    isValidBoardRowCol(board: Coord): boolean;
    isValidMove(boardRowCol: Coord, move: Coord): boolean;
    addMyMove(boardRowCol: Coord, move: Coord): MainBoard;
    addOpponentMove(boardRowCol: Coord, move: Coord): MainBoard;
    move(player: number, board: Coord, move: Coord): MainBoard;
    getValidBoards(): Coord[];
    prettyPrint(): string;
    copy(): MainBoard;
}

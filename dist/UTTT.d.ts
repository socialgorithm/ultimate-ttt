import SubBoard from './model/SubBoard';
export declare type Coord = [number, number];
export interface Coords {
    board: Coord;
    move: Coord;
}
export default class UTTT {
    board: Array<Array<SubBoard>>;
    nextBoard: Coord;
    winner: number;
    private size;
    private maxMoves;
    private stateBoard;
    private moves;
    constructor(size?: number);
    isFinished(): boolean;
    getResult(): number;
    isValidBoardRowCol(boardRowCol: Coord): boolean;
    isValidMove(boardRowCol: Coord, move: Coord): boolean;
    addMyMove(boardRowCol: Coord, move: Coord): UTTT;
    addOpponentMove(boardRowCol: Coord, move: Coord): UTTT;
    move(board: Coord, player: number, move: Coord): UTTT;
    prettyPrint(): string;
    copy(): UTTT;
}

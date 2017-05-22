import SubBoard from './model/SubBoard';
export declare type Coord = [number, number];
export interface Coords {
    board: Coord;
    move: Coord;
}
export default class UTTT {
    board: Array<Array<SubBoard>>;
    nextBoard: Coord;
    private size;
    private maxMoves;
    private stateBoard;
    private moves;
    private winner;
    constructor(size?: number);
    isFinished(): boolean;
    getResult(): number;
    isValidBoardRowCol(boardRowCol: Coord): boolean;
    isValidMove(boardRowCol: Coord, move: Coord): boolean;
    addMyMove(boardRowCol: Coord, move: Coord): UTTT;
    addOpponentMove(boardRowCol: Coord, move: Coord): UTTT;
    prettyPrint(): string;
    private init();
    copy(): UTTT;
    private move(board, player, move);
}

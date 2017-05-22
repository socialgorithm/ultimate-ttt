export default class UTTT {
    private size;
    private maxMoves;
    private stateBoard;
    private board;
    private nextBoard;
    private moves;
    private winner;
    constructor(size?: number);
    isFinished(): boolean;
    getResult(): number;
    isValidBoardRowCol(boardRowCol: Array<number>): boolean;
    isValidMove(boardRowCol: Array<number>, move: Array<number>): boolean;
    addMyMove(boardRowCol: Array<number>, move: Array<number>): UTTT;
    addOpponentMove(boardRowCol: Array<number>, move: Array<number>): UTTT;
    prettyPrint(): string;
    _init(): void;
    _copy(): UTTT;
    _move(board: Array<number>, player: number, move: Array<number>): UTTT;
}

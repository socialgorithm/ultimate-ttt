import SubBoard from './model/SubBoard';
export default class UTTT {
    board: Array<Array<SubBoard>>;
    nextBoard: Array<number>;
    private size;
    private maxMoves;
    private stateBoard;
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
    private init();
    copy(): UTTT;
    private move(board, player, move);
}

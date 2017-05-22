export declare const ME = 0;
export declare const OPPONENT = 1;
export declare const RESULT_TIE = -1;
export declare const RESULT_WIN = 0;
export declare const RESULT_LOSE = 1;
export default class SubBoard {
    private size;
    private maxMoves;
    winner: number;
    constructor(size?: number);
    isFinished(): boolean;
    getResult(): number;
    isValidMove(move: any): boolean;
    addMyMove(move: any, index?: number): SubBoard;
    addOpponentMove(move: any, index?: number): SubBoard;
    prettyPrint(): string;
    _init(): void;
    _copy(): SubBoard;
    _move(player: any, move: any, index?: number): SubBoard;
    _isValidPlayer(player: any): boolean;
    _checkRow(row: any): void;
    _checkColumn(col: any): void;
    _checkLtRDiagonal(): void;
    _checkRtLDiagonal(): void;
    _isFull(): boolean;
}

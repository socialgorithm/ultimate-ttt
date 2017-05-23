import Cell from './model/Cell';
import { Coord, PlayerNumber } from "./model/constants";
import TTT from "./model/TTT";
export default class SubBoard extends TTT<Cell> {
    board: Array<Array<Cell>>;
    constructor(size?: number);
    isFinished(): boolean;
    getResult(): number;
    isValidMove(move: Coord): boolean;
    addMyMove(move: Coord, index?: number): SubBoard;
    addOpponentMove(move: Coord, index?: number): SubBoard;
    move(player: PlayerNumber, move: Coord, index?: number): SubBoard;
    prettyPrint(): string;
    copy(): SubBoard;
    private isValidPlayer(player);
    private checkRow(row);
    private checkColumn(col);
    private checkLtRDiagonal();
    private checkRtLDiagonal();
}

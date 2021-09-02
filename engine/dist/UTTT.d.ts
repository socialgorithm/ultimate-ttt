import SubBoard from './SubBoard';
import { Coord } from './model/constants';
import TTT from "./model/TTT";
export default class UTTT extends TTT<SubBoard> {
    board: Array<Array<SubBoard>>;
    stateBoard: SubBoard;
    constructor(size?: number);
    isFinished(): boolean;
    getResult(): number;
    isValidBoardRowCol(board: Coord): boolean;
    isValidMove(boardRowCol: Coord, move: Coord): boolean;
    addMyMove(boardRowCol: Coord, move: Coord): UTTT;
    addOpponentMove(boardRowCol: Coord, move: Coord): UTTT;
    move(player: number, board: Coord, move: Coord): UTTT;
    getValidBoards(): Array<Coord>;
    prettyPrint(): string;
    copy(): UTTT;
}

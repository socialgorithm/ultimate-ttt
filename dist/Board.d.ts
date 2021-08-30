import { Coord, PlayerOrTie } from "./Constants";
declare abstract class Board<CellType> {
    board: CellType[][];
    nextBoard: Coord;
    winner: PlayerOrTie;
    protected size: number;
    protected maxMoves: number;
    protected moves: number;
    private _winner;
    abstract isFinished(): boolean;
    abstract getResult(): number;
    abstract prettyPrint(): string;
    getMoves(): number;
    abstract copy(): Board<CellType>;
}
export default Board;

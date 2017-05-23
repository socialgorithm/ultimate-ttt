import { Coord } from "./constants";
declare abstract class TTT<CellType> {
    board: Array<Array<CellType>>;
    nextBoard: Coord;
    winner: number;
    protected size: number;
    protected maxMoves: number;
    protected moves: number;
    abstract isFinished(): boolean;
    abstract getResult(): number;
    abstract prettyPrint(): string;
    getMoves(): number;
    isFull(): boolean;
    abstract copy(): TTT<CellType>;
}
export default TTT;

import { PlayerOrTie, Coord } from "./Constants";
export default class Cell {
    coordinates: Coord;
    player: PlayerOrTie;
    subBoardIndex: number;
    mainIndex: number;
    constructor(coordinates?: Coord, player?: PlayerOrTie, subBoardIndex?: number, mainIndex?: number);
    copy(): Cell;
    isPlayed(): boolean;
}

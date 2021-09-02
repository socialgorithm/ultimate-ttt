import { PlayerOrTie, Coord } from "./constants";
export default class Cell {
    coordinates: Coord;
    player: PlayerOrTie;
    subBoardIndex: number;
    mainIndex: number;
    constructor(coordinates?: Coord, player?: PlayerOrTie, subBoardIndex?: number, mainIndex?: number);
    copy(): Cell;
    isPlayed(): boolean;
}

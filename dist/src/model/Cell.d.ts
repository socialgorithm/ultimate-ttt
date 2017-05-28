import { PlayerOrTie } from "./constants";
export default class Cell {
    player: PlayerOrTie;
    subBoardIndex: number;
    mainIndex: number;
    constructor(player?: PlayerOrTie, subBoardIndex?: number, mainIndex?: number);
    copy(): Cell;
    isPlayed(): boolean;
}

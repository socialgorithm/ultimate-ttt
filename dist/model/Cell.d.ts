import { PlayerOrTie } from "./constants";
export default class Cell {
    private _player;
    private _subBoardIndex;
    private _mainIndex;
    constructor(player?: PlayerOrTie, subBoardIndex?: number, mainIndex?: number);
    isPlayed(): boolean;
    player: PlayerOrTie;
    subBoardIndex: number;
    mainIndex: number;
}

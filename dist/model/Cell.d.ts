import { PlayerNumber, PlayerOrTie } from "./constants";
export default class Cell {
    private _player;
    private _subBoardIndex;
    private _mainIndex;
    constructor(player?: PlayerOrTie, subBoardIndex?: number, mainIndex?: number);
    setPlayer(value: PlayerNumber): void;
    readonly player: PlayerOrTie;
    subBoardIndex: number;
    mainIndex: number;
}

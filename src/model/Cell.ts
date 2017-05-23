import {PlayerNumber, PlayerOrTie} from "./constants";
/**
 * Definition of each Cell on a SubBoard
 */
export default class Cell {
  private _player: PlayerOrTie;
  private _subBoardIndex: number;
  private _mainIndex: number;

  constructor(player: PlayerOrTie = -1, subBoardIndex: number = -1, mainIndex: number = -1) {
    this._player = player;
    this._subBoardIndex = subBoardIndex;
    this._mainIndex = mainIndex;

    return this;
  }

  public setPlayer(value: PlayerNumber) {
    this._player = value;
  }

  get player(): PlayerOrTie {
    return this._player;
  }

  set subBoardIndex(value: number) {
    this._subBoardIndex = value;
  }

  set mainIndex(value: number) {
    this._mainIndex = value;
  }

  get subBoardIndex(): number {
    return this._subBoardIndex;
  }

  get mainIndex(): number {
    return this._mainIndex;
  }
}
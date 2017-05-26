import {PlayerNumber, PlayerOrTie, UNPLAYED} from "./constants";
/**
 * Definition of each Cell on a SubBoard
 */
export default class Cell {
  /**
   * The player who has played in this cell (or null if it hasn't been played)
   */
  private _player: PlayerOrTie;
  /**
   * When was this cell played on the small board (for replaying)
   */
  private _subBoardIndex: number;
  /**
   * When was this cell played on the big board (for replaying)
   */
  private _mainIndex: number;

  constructor(player: PlayerOrTie = UNPLAYED, subBoardIndex: number = -1, mainIndex: number = -1) {
    this._player = player;
    this._subBoardIndex = subBoardIndex;
    this._mainIndex = mainIndex;

    return this;
  }

  /**
   * Returns true if the cell has been played already
   * @returns {boolean}
   */
  public isPlayed() {
    return this.player !== UNPLAYED;
  }

  /**
   * Set a player for this cell
   * @param value
   */
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
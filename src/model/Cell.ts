/**
 * Definition of each Cell on a SubBoard
 */
export default class Cell {
  public player: number;
  public subBoardIndex: number;
  public mainIndex: number;

  constructor(player: number = -1, subBoardIndex: number = -1, mainIndex: number = -1) {
    this.player = player;
    this.subBoardIndex = subBoardIndex;
    this.mainIndex = mainIndex;

    return this;
  }
}
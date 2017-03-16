/**
 * Definition of each Cell on a SubBoard
 */
export default class Cell {
  constructor(player = -1, subBoardIndex = -1, mainIndex = -1) {
    this.player = player;
    this.subBoardIndex = subBoardIndex;
    this.mainIndex = mainIndex;

    return this;
  }
}
/**
 * Definition of each Cell on a SubBoard
 */
export default class Cell {
  constructor(player = -1, index = -1) {
    this.player = player;
    this.index = index;

    return this;
  }
}
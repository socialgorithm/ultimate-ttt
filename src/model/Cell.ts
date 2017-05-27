import {PlayerNumber, PlayerOrTie, UNPLAYED} from "./constants";
/**
 * Definition of each Cell on a SubBoard
 */
export default class Cell {

  constructor(public player: PlayerOrTie = -1, public subBoardIndex: number = -1,  public mainIndex: number = -1) { }

  copy() {
    return new Cell(this.player, this.subBoardIndex, this.mainIndex);
  }

  isPlayed() {
    return this.player !== UNPLAYED;
  }
  
}
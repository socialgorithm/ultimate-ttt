import {PlayerNumber, PlayerOrTie, UNPLAYED, Coord} from "./constants";
/**
 * Definition of each Cell on a SubBoard
 */
export default class Cell {

  constructor(public coordinates : Coord = [0, 0], public player: PlayerOrTie = -1, public subBoardIndex: number = -1,  public mainIndex: number = -1) { }

  copy() {
    return new Cell(this.coordinates, this.player, this.subBoardIndex, this.mainIndex);
  }

  isPlayed() {
    return this.player > -1;
  }

}
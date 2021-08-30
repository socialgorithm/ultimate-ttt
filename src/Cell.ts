import {PlayerOrTie, UNPLAYED, Coord, RESULT_TIE} from "./Constants";
/**
 * Definition of each Cell on a SubBoard
 */
export default class Cell {

  constructor(public coordinates: Coord = [0, 0], public player: PlayerOrTie = UNPLAYED, public subBoardIndex: number = -1,  public mainIndex: number = -1) { }

  public copy() {
    return new Cell(this.coordinates, this.player, this.subBoardIndex, this.mainIndex);
  }

  public isPlayed() {
    return this.player > RESULT_TIE;
  }

}

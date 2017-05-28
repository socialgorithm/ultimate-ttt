import errors from './model/errors';
import Cell from './model/Cell';
import error from './error';
import {Coord, ME, OPPONENT, PlayerNumber, PlayerOrTie, RESULT_TIE, UNPLAYED} from "./model/constants";
import TTT from "./model/TTT";
import { isInteger } from './utility';

/**
 * SubBoard for TicTacToe games
 * This class implements the traditional game of TicTacToe
 */
export default class SubBoard extends TTT<Cell> {
  /**
   * Holds the state of the game board as a two dimensional array
   * each element of the inner array is a Cell
   */
  public board: Array<Array<Cell>>;

  constructor(size = 3){
    super();
    this.size = size;

    // Game state
    this.board = [];
    this.moves = 0;

    for(let x = 0; x < this.size; x++){
      this.board[x] = [];
      for(let y = 0; y < this.size; y++){
        this.board[x][y] = new Cell([x, y]);
      }
    }

    // the maximum number of moves before filling up the board
    this.maxMoves = Math.pow(this.size, 2);

    return this;
  }

  /**
   * Returns true if the game is over, undefined if it hasn't finished yet
   */
  public isFinished(): boolean {
    return this.winner !== undefined;
  }

  /**
   * Returns the winner for the game, throws an exception if the game hasn't finished yet.
   * @returns {number} -1 for a tie, 0 you won, 1 opponent won
   */
  public getResult(): number {
    if (!this.isFinished()) {
      throw error(errors.gameNotFinished);
    }
    return this.winner;
  }

  /**
   * Validates a given move (check for right format, data ranges, and
   * that the move hasn't already been played)
   * @param move Move coordinates as an array [x, y]
   * @returns {boolean} true if the move is valid
   */
  public isValidMove(move: Coord): boolean {
    return Array.isArray(move) &&
      move.length === 2 &&
      isInteger(move[0]) &&
      isInteger(move[1]) &&
      move[0] > -1 &&
      move[1] > -1 &&
      move[0] < this.size &&
      move[1] < this.size && 
      !this.board[move[0]][move[1]].isPlayed();
  }

  /**
   * Adds your move to the board, throws exception if move is invalid or board is already finished.
   * @param move move coordinates
   * @param index which turn this was (to enable replaying UTTT games)
   * @returns {SubBoard}
   */
  public addMyMove(move: Coord, index = -1): SubBoard{
    return this.move(ME, move, false, index);
  }

  /**
   * Adds an opponent move to the board, throws exception if move is invalid or board is already finished.
   * @param move
   * @param index which turn this was (to enable replaying UTTT games)
   * @returns {SubBoard}
   */
  public addOpponentMove(move: Coord, index = -1): SubBoard {
    return this.move(OPPONENT, move, false, index)
  }

  /**
   * Execute a move. This is an immutable method, that returns a
   * new SubBoard. It may be easier and more clear to use the addOpponentMove and addMyMove methods instead.
   * @param player Player identifier (0 || 1)
   * @param move Move coordinates as an array [x, y]
   * @param allowTies Whether we should allow adding a TIE (-1) as a player
   * @param index which turn this was (to enable replaying UTTT games)
   * @returns {SubBoard} Updated copy of the current game with the move added and the state updated
   */
  public move(player: PlayerOrTie, move: Coord, allowTies: boolean = false, index: number = -1): SubBoard {
    if(this.isFull() || this.isFinished()) {
      throw error(errors.boardFinished);
    }

    if (!this.isValidPlayer(player as PlayerNumber, allowTies)) {
      throw error(errors.player, player);
    }

    if (!this.isValidMove(move)) {
      if (move) {
        throw error(errors.move, move);
      }
      throw error(errors.move);
    }
    const game = this.copy();

    game.board[move[0]][move[1]].player = player;
    game.board[move[0]][move[1]].subBoardIndex = game.moves;
    game.board[move[0]][move[1]].mainIndex = index;
    game.moves++;

    // Check if the board has been won
    game.checkRow(move[0]);

    if (!game.isFinished()) {
      game.checkColumn(move[1]);
    }

    if (!game.isFinished()) {
      game.checkLtRDiagonal();
    }

    if (!game.isFinished()) {
      game.checkRtLDiagonal();
    }

    // check for a tie
    if (game.isFull() && game.winner === UNPLAYED) {
      game.winner = RESULT_TIE;
    }

    return game;
  }

  /**
   * Get a list of all the valid moves in the board
   */
  public getValidMoves(): Array<Coord> {
    const moves: Array<Coord> = [];
    for(let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (!this.board[x][y].isPlayed()) {
          moves.push([x, y]);
        }
      }
    }
    return moves;
  }

  /**
   * Returns a string with the board formatted for display
   * including new lines.
   * @returns {string}
   */
  public prettyPrint(printTies: boolean = false): string {
    let ret = [];
    for(let x = 0; x < this.size; x++) {
      let line = '';
      for (let y = 0; y < this.size; y++) {
        let player = '-';
        if (printTies && this.board[x][y].player === RESULT_TIE) {
          player = '+';
        } else if(this.board[x][y].player !== UNPLAYED && this.board[x][y].player >= ME) {
          player = `${this.board[x][y].player}`;
        }
        line += player + ' ';
      }
      ret.push(line);
    }
    return ret.join("\n");
  }

  /**
   * Return a new SubBoard as a copy of this one
   * @returns {SubBoard} Copy of the current game
   */
  public copy(): SubBoard {
    const copy = new SubBoard(this.size);
    copy.board = this.board.map(copyRow => copyRow.map(c => c.copy()));
    copy.moves = this.moves;
    
    if (this.winner !== undefined) {
      copy.winner = this.winner;
    }

    return copy;
  }

  /**
   * Validates a player
   * @param player Player identifier (0 || 1)
   * @param allowTies Whether we should allow adding a TIE (-1) as a player
   * @returns {boolean}
   */
  private isValidPlayer(player: PlayerNumber, allowTies: boolean = false): boolean {
    const validPlayers = [ ME, OPPONENT ];
    if (allowTies) {
      validPlayers.push(RESULT_TIE);
    }
    return validPlayers.indexOf(player) > -1;
  }

  /**
   * Same as isFinished()
   * @returns {boolean}
   */
  public isFull(): boolean {
    return this.moves >= this.maxMoves;
  }

  /**
   * Check if a given row has been won
   * @param row Row index
   * @private
   */
  private checkRow(row: number): void {
    const player = this.board[row][0].player;
    if(player < ME){
      return;
    }
    for(let i = 1; i < this.size; i++){
      if(player !== this.board[row][i].player) {
        return;
      }
    }
    if (player >= ME) {
      this.winner = player;
    }
  }

  /**
   * Check if a given column has been won
   * @param col Column index
   */
  private checkColumn(col: number): void {
    const player = this.board[0][col].player;
    if(player < ME){
      return;
    }
    for(let i = 1; i < this.size; i++){
      if(player !== this.board[i][col].player) {
        return;
      }
    }
    if (player >= ME) {
      this.winner = player;
    }
  }

  /**
   * Check if the left to right diagonal has been won
   */
  private checkLtRDiagonal(): void {
    const player = this.board[0][0].player;
    if(player < ME){
      return;
    }
    for(let i = 1; i < this.size; i++){
      if(player !== this.board[i][i].player){
        return;
      }
    }
    if (player >= ME) {
      this.winner = player;
    }
  }

  /**
   * Check if the right to left diagonal has been won
   */
  private checkRtLDiagonal(): void {
    const player = this.board[0][this.size - 1].player;
    if(player < ME){
      return;
    }
    for(let i = this.size - 1; i >= 0; i--){
      if(player !== this.board[this.size - 1 - i][i].player){
        return;
      }
    }
    if (player >= ME) {
      this.winner = player;
    }
  }
}
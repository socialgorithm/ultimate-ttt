import errors from './model/errors';
import Cell from './model/Cell';
import error from './error';
import {Coord, ME, OPPONENT, RESULT_TIE} from "./model/constants";
import TTT from "./model/TTT";
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
    this.winner = RESULT_TIE - 1;

    for(let x = 0; x < this.size; x++){
      this.board[x] = [];
      for(let y = 0; y < this.size; y++){
        this.board[x][y] = new Cell();
      }
    }

    // the maximum number of moves before filling up the board
    this.maxMoves = Math.pow(this.size, 2);

    return this;
  }

  /**
   * Returns true if the game is over
   */
  public isFinished(): boolean {
    return this.winner >= RESULT_TIE;
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
    return !(
      !Array.isArray(move) ||
      move.length !== 2 ||
      move[0] < 0 ||
      move[0] > this.size ||
      move[1] < 0 ||
      move[1] > this.size ||
      typeof(this.board[move[0]][move[1]]) === 'undefined' ||
      this.board[move[0]][move[1]].player >= ME
    );
  }

  /**
   * Adds your move to the board, throws exception if move is invalid or board is already finished.
   * @param move move coordinates
   * @param index which turn this was (to enable replaying UTTT games)
   * @returns {SubBoard}
   */
  public addMyMove(move: Coord, index = -1): SubBoard{
    return this.move(ME, move, index);
  }

  /**
   * Adds an opponent move to the board, throws exception if move is invalid or board is already finished.
   * @param move
   * @param index which turn this was (to enable replaying UTTT games)
   * @returns {SubBoard}
   */
  public addOpponentMove(move: Coord, index = -1): SubBoard {
    return this.move(OPPONENT, move, index)
  }

  /**
   * Execute a move. This is an immutable method, that returns a
   * new SubBoard. It may be easier and more clear to use the addOpponentMove and addMyMove methods instead.
   * @param player Player identifier (0 || 1)
   * @param move Move coordinates as an array [x, y]
   * @param index which turn this was (to enable replaying UTTT games)
   * @returns {SubBoard} Updated copy of the current game with the move added and the state updated
   */
  public move(player: number, move: Coord, index = -1): SubBoard {
    if(this.isFull() || this.isFinished()) {
      throw error(errors.boardFinished);
    }

    if (!this.isValidPlayer(player)) {
      throw error(errors.player, player);
    }

    if (!this.isValidMove(move)) {
      if (move) {
        throw error(errors.move, move.toString());
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
    if (game.isFull() && game.winner < RESULT_TIE){
      game.winner = RESULT_TIE;
    }

    return game;
  }

  /**
   * Returns a string with the board formatted for display
   * including new lines.
   * @returns {string}
   */
  public prettyPrint(): string {
    let ret = [];
    for(let x = 0; x < this.size; x++) {
      let line = '';
      for (let y = 0; y < this.size; y++) {
        const player = (this.board[x][y].player < 0)? '-' : this.board[x][y].player;
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
    copy.board = this.board;
    copy.moves = this.moves;
    copy.winner = this.winner;
    return copy;
  }

  /**
   * Validates a player
   * @param player Player identifier (0 || 1)
   * @returns {boolean}
   */
  private isValidPlayer(player: number): boolean {
    return [ ME, OPPONENT ].indexOf(player) > -1;
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
import errors from './errors';
import error from '../error';
import Cell from './Cell';

export const ME = 0;
export const OPPONENT = 1;

export const RESULT_TIE = -1;
export const RESULT_WIN = 0;
export const RESULT_LOSE = 1;

/**
 * TicTacToe board implementation
 * Players must be indicated with 1 or 2
 * Moves with an array of [x, y]
 */
export default class SubBoard {
  constructor(size = 3){
    this.size = size;
    this._init();

    // the maximum number of moves before filling up the board
    this.maxMoves = Math.pow(this.size, 2);

    return this;
  }

  /* --------- Public API --------- */

  /**
   * Returns true if the game is over
   */
  isFinished(){
    return this.winner >= RESULT_TIE;
  }

  /**
   * Returns the winner for the board, throws an exception if the game hasn't finished yet.
   * @returns {number} -1 for a tie, 0 you won, 1 opponent won
   */
  getResult() {
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
  isValidMove(move){
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

  addMyMove(move) {
    return this._move(ME, move);
  }

  addOpponentMove(move) {
    return this._move(OPPONENT, move)
  }

  /**
   * Returns a string with the board formatted for display
   * including new lines.
   * @returns {string}
   */
  prettyPrint(){
    let ret = [];
    for(let x = 0; x < this.size; x++) {
      let line = '';
      for (let y = 0; y < this.size; y++) {
        line += this.board[x][y] + ' ';
      }
      ret.push(line);
    }
    return ret.join("\n");
  }

  /* --------- Private API --------- */

  /**
   * Initialise the game
   * In normal usage you should create a new SubBoard object for this
   * but sometimes it may be useful to reset the current instance.
   * @private
   */
  _init(){
    this.board = [];
    this.moves = 0;
    this.winner = RESULT_TIE - 1;

    for(let x = 0; x < this.size; x++){
      this.board[x] = [];
      for(let y = 0; y < this.size; y++){
        this.board[x][y] = new Cell();
      }
    }
  }

  /**
   * Return a new SubBoard as a copy of this one
   * @returns {SubBoard} Copy of the current board
   * @private
   */
  _copy() {
    const copy = new SubBoard(this.size);
    copy._init();
    copy.board = this.board;
    copy.moves = this.moves;
    copy.winner = this.winner;
    return copy;
  }

  /**
   * Execute a move. This is an immutable method, that returns a
   * new SubBoard.
   * @param player Player identifier (0 || 1)
   * @param move Move coordinates as an array [x, y]
   * @returns {SubBoard} Updated copy of the current board with the move added and the state updated
   * @private
   */
  _move(player, move){
    if(this._isFull() || this.isFinished()) {
      throw error(errors.boardFinished);
    }

    if (!this._isValidPlayer(player)) {
      throw error(errors.player, player);
    }

    if (!this.isValidMove(move)) {
      throw error(errors.move, move);
    }
    const game = this._copy();

    game.board[move[0]][move[1]].player = player;
    game.board[move[0]][move[1]].index = this.moves;
    game.moves++;

    // Check if the board has been won
    game._checkRow(move[0]);
    game._checkColumn(move[1]);

    game._checkLtRDiagonal();
    game._checkRtLDiagonal();

    // check for a tie
    if (game._isFull() && game.winner < -1){
      game.winner = RESULT_TIE;
    }

    return game;
  }

  /**
   * Validates a player
   * @param player Player identifier (1 || 2)
   * @returns {boolean}
   * @private
   */
  static _isValidPlayer(player){
    return !(!player || !Number.isInteger(player) || (player !== ME && player !== OPPONENT));
  }

  /**
   * Check if a given row has been won
   * @param row Row index
   * @private
   */
  _checkRow(row){
    const player = this.board[row][0].player;
    if(player === 0){
      return;
    }
    for(let i = 1; i < this.size; i++){
      if(player !== this.board[row][i].player) {
        return;
      }
    }
    this.winner = player;
  }

  /**
   * Check if a given column has been won
   * @param col Column index
   * @private
   */
  _checkColumn(col){
    const player = this.board[0][col].player;
    if(player === 0){
      return;
    }
    for(let i = 1; i < this.size; i++){
      if(player !== this.board[i][col].player) {
        return;
      }
    }
    this.winner = player;
  }

  /**
   * Check if the left to right diagonal has been won
   * @private
   */
  _checkLtRDiagonal(){
    const player = this.board[0][0].player;
    if(player === 0){
      return;
    }
    for(let i = 1; i < this.size; i++){
      if(player !== this.board[i][i].player){
        return;
      }
    }
    this.winner = player;
  }

  /**
   * Check if the right to left diagonal has been won
   * @private
   */
  _checkRtLDiagonal(){
    const player = this.board[0][this.size - 1].player;
    if(player === 0){
      return;
    }
    for(let i = this.size - 1; i >= 0; i--){
      if(player !== this.board[this.size - 1 - i][i].player){
        return;
      }
    }
    this.winner = player;
  }

  /**
   * Check if the board is full
   * @returns {boolean}
   * @private
   */
  _isFull(){
    return this.moves === this.maxMoves;
  }
}
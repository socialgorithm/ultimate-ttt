import SubBoard from './model/SubBoard';
import errors from './model/errors';
import error from './error';

import { ME, OPPONENT, RESULT_TIE } from './model/SubBoard';

/**
 * UTTT MainBoard Class
 * Implements a functional/immutable API
 *
 * Docs: https://github.com/socialgorithm/ultimate-ttt-js/wiki
 */
export default class UTTT {
  constructor(size = 3){
    this.size = size;
    this.maxMoves = Math.pow(this.size, 4);

    this._init();

    return this;
  }

  /* --------- Public API --------- */

  /**
   * Returns true if the game is over
   */
  isFinished(){
    return (this.stateBoard.isFinished() || this.moves === this.maxMoves);
  }

  /**
   * Returns the winner for the game, throws an exception if the game hasn't finished yet.
   * @returns {number} -1 for a tie, 0 you won, 1 opponent won
   */
  getResult(){
    return this.stateBoard.getResult();
  }

  /**
   * Validates a board selection before playing it
   * @param boardRowCol Board coordinates as an array [row, col]
   * @returns {boolean} true if the board is playable
   */
  isValidBoardRowCol(boardRowCol){
    if(!this.nextBoard){
      return !(
        !Array.isArray(boardRowCol) ||
        boardRowCol.length !== 2 ||
        boardRowCol[0] < 0 ||
        boardRowCol[0] > this.size ||
        boardRowCol[1] < 0 ||
        boardRowCol[1] > this.size ||
        typeof(this.board[boardRowCol[0]][boardRowCol[1]]) === 'undefined'
      );
    }else{
      return Array.isArray(boardRowCol) &&
        this.nextBoard[0] === boardRowCol[0] &&
        this.nextBoard[1] === boardRowCol[1];
    }
  }

  /**
   * Validates a given board & move combination (check for right format, data ranges, and
   * that the move hasn't already been played)
   * @param boardRowCol Board coordinates [row, col]
   * @param move Move coordinates [row, col]
   * @returns {boolean} true if the move is valid
   */
  isValidMove(boardRowCol, move){
    if(!this.isValidBoardRowCol(boardRowCol)){
      return false;
    }
    return this.board[boardRowCol[0]][boardRowCol[1]].isValidMove(move);
  }

  /**
   * Adds your move to the board, throws exception if move is invalid or board is already finished.
   * @param boardRowCol
   * @param move
   * @returns {UTTT}
   */
  addMyMove(boardRowCol, move){
    return this._move(boardRowCol, ME, move);
  }

  /**
   * Adds an opponent move to the board, throws exception if move is invalid or board is already finished.
   * @param boardRowCol
   * @param move
   * @returns {UTTT}
   */
  addOpponentMove(boardRowCol, move){
    return this._move(boardRowCol, OPPONENT, move);
  }

  /**
   * Returns a string with the board formatted for display
   * including new lines.
   * @returns {string}
   */
  prettyPrint(){
    let rows = [];
    for(let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const small = this.board[x][y].prettyPrint().split("\n");

        for(let row = 0; row < this.size; row++){
          const xCoord = x * this.size + row;
          if(!rows[xCoord]){
            rows[xCoord] = [];
          }
          rows[xCoord][y] = small[row];
        }
      }
    }
    let ret = [];
    for(let x = 0; x < rows.length; x++){
      ret.push(rows[x].join('| '));
      if((x + 1) % this.size === 0) {
        let sepChars = '';
        for(let i = 0; i < this.size * 2; i++){
          sepChars += '-';
        }
        sepChars += '+';
        let sep = sepChars;
        for(let i = 1; i < this.size; i++){
          sep += '-' + sepChars;
        }
        ret.push(sep.substr(0, sep.length - 1));
      }
    }
    return ret.join("\n");
  }

  /* --------- Private API --------- */

  /**
   * Initialize the game
   * @private
   */
  _init() {
    // Game state
    this.board = [];
    this.moves = 0;
    this.winner = RESULT_TIE - 1;
    this.nextBoard = null;

    // The state board holds the ultimate game state
    this.stateBoard = new SubBoard(this.size);

    for(let x = 0; x < this.size; x++){
      this.board[x] = [];
      for(let y = 0; y < this.size; y++){
        this.board[x][y] = new SubBoard(this.size);
      }
    }
  }

  /**
   * Return a new UTTT board as a copy of this one
   * @returns {UTTT} Copy of the current game
   * @private
   */
  _copy() {
    const copy = new UTTT(this.size);
    copy._init();
    copy.board = this.board;
    copy.moves = this.moves;
    copy.winner = this.winner;
    copy.nextBoard = this.nextBoard;
    copy.stateBoard = this.stateBoard;
    return copy;
  }

  /**
   * Execute a move
   * @param player Player identifier (1 || 2)
   * @param board Board coordinates as an array [x, y]
   * @param move Move coordinates as an array [x, y]
   * @returns {UTTT} Updated copy of the current game with the move added and the state updated
   * @private
   */
  _move(board, player, move){
    if(this.isFinished()) {
      throw error(errors.gameFinished);
    }

    // Make sure we're dealing with ints
    board[0] = parseInt(board[0], 10);
    board[1] = parseInt(board[1], 10);

    move[0] = parseInt(move[0], 10);
    move[1] = parseInt(move[1], 10);

    if(!this.isValidBoardRowCol(board)){
      throw error(errors.board, board);
    }

    if(!this.isValidMove(board, move)){
      throw error(errors.move, move);
    }

    const game = this._copy();
    let updatedBoard;

    if (player === ME) {
      updatedBoard = this.board[board[0]][board[1]].addMyMove(move);
    } else if (player === OPPONENT) {
      updatedBoard = this.board[board[0]][board[1]].addOpponentMove(move);
    } else {
      throw error(errors.player, player);
    }

    // update the copy
    game.board[board[0]][board[1]] = updatedBoard;
    game.moves++;

    game.nextBoard = move;
    if(game.board[game.nextBoard[0]][game.nextBoard[1]].isFinished()){
      game.nextBoard = false;
    }

    // Update the game board state
    if(
        game.board[board[0]][board[1]].isFinished() &&
        game.board[board[0]][board[1]].winner >= RESULT_TIE
    ){
      game.stateBoard = game.stateBoard._move(
        game.board[board[0]][board[1]].winner,
        board
      );
    }

    game.winner = game.stateBoard.winner;
    return game;
  }
}
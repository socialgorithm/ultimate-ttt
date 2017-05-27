import * as clone from 'clone';
import SubBoard from './SubBoard';
import errors from './model/errors';
import error from './error';

import {Coord, ME, OPPONENT} from './model/constants';
import TTT from "./model/TTT";

/**
 * Ultimate Tic Tac Toe Class
 *
 * This holds a full game, with all the associated state, and exposes several methods to interact with it.
 *
 * All methods that modify the state have been implemented as a functional/immutable API, which means that
 * they return a modified game, but don't change the original one.
 * This has been done to make tree searching easier, since your root nodes at each step won't be accidentally modified.
 */
export default class UTTT extends TTT<SubBoard> {
  /**
   * Holds the state of the game board as a two dimensional array
   * each element of the inner array is a SubBoard
   */
  public board: Array<Array<SubBoard>>;
  /**
   * The state board is a typical 3x3 TTT board that holds the "state" of the big game
   * so if a cell of the big game has been won, it will be 0 or 1 on this state board.
   * This is very useful to easily see "the big picture" in the game.
   */
  public stateBoard: SubBoard;

  constructor(size: number = 3){
    super();
    this.size = size;
    this.maxMoves = Math.pow(this.size, 4);

    // Game state
    this.board = [];
    this.moves = 0;
    this.winner = null;
    this.nextBoard = null;

    // The state board holds the ultimate game state
    this.stateBoard = new SubBoard(this.size);

    for(let x = 0; x < this.size; x++){
      this.board[x] = [];
      for(let y = 0; y < this.size; y++){
        this.board[x][y] = new SubBoard(this.size);
      }
    }

    return this;
  }

  /**
   * Returns true if the game is over
   */
  public isFinished(): boolean {
    return (this.stateBoard.isFinished() || this.moves === this.maxMoves);
  }

  /**
   * Returns the winner for the game, throws an exception if the game hasn't finished yet.
   * @returns {number} -1 for a tie, 0 you won, 1 opponent won
   */
  public getResult(): number {
    return this.stateBoard.getResult();
  }

  /**
   * Validates a board selection before playing it
   * @param boardRowCol Board coordinates as an array [row, col]
   * @returns {boolean} true if the board is playable
   */
  public isValidBoardRowCol(boardRowCol: Coord): boolean {
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
  public isValidMove(boardRowCol: Coord, move: Coord): boolean {
    if(!this.isValidBoardRowCol(boardRowCol)){
      return false;
    }
    return this.board[boardRowCol[0]][boardRowCol[1]].isValidMove(move);
  }

  /**
   * Adds your move to the board, throws exception if move is invalid or board is already finished.
   * @param boardRowCol Board coordinates [row, col]
   * @param move Move coordinates [row, col]
   * @returns {UTTT} Updated copy of the current game with the move added and the state updated
   */
  public addMyMove(boardRowCol: Coord, move: Coord): UTTT {
    return this.move(boardRowCol, ME, move);
  }

  /**
   * Adds an opponent move to the board, throws exception if move is invalid or board is already finished.
   * @param boardRowCol Board coordinates [row, col]
   * @param move Move coordinates [row, col]
   * @returns {UTTT} Updated copy of the current game with the move added and the state updated
   */
  public addOpponentMove(boardRowCol: Coord, move: Coord): UTTT {
    return this.move(boardRowCol, OPPONENT, move);
  }

  /**
   * Execute a move
   * @param player Player identifier (1 || 2)
   * @param board Board coordinates as an array [x, y]
   * @param move Move coordinates as an array [x, y]
   * @returns {UTTT} Updated copy of the current game with the move added and the state updated
   */
  public move(board: Coord, player: number, move: Coord): UTTT {
    if(this.isFinished()) {
      throw error(errors.gameFinished);
    }

    if(!this.isValidBoardRowCol(board)){
      throw error(errors.board, board);
    }

    if(!this.isValidMove(board, move)){
      throw error(errors.move, move);
    }

    const game = this.copy();
    let updatedBoard = game.board[board[0]][board[1]];

    if (player === ME) {
      updatedBoard = updatedBoard.addMyMove(move, game.moves);
    } else if (player === OPPONENT) {
      updatedBoard = updatedBoard.addOpponentMove(move, game.moves);
    } else {
      throw error(errors.player, player);
    }

    // update the copy
    game.board[board[0]][board[1]] = updatedBoard;
    game.moves++;

    game.nextBoard = move;
    if(game.board[game.nextBoard[0]][game.nextBoard[1]].isFinished()){
      game.nextBoard = null;
    }

    // Update the game board state
    if(
        game.board[board[0]][board[1]].isFinished()
    ){
      game.stateBoard = game.stateBoard.move(
          game.board[board[0]][board[1]].winner,
          board
      );
    }

    game.winner = game.stateBoard.winner;
    return game;
  }

  /**
   * Get a list of all the valid sub-boards in the main board
   */
  public getValidBoards(): Array<Coord> {
    const boards: Array<Coord> = [];
    for(let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (!this.board[x][y].isFinished()) {
          boards.push([x, y]);
        }
      }
    }
    return boards;
  }

  /**
   * Returns a string with the board formatted for display
   * including new lines.
   * @returns {string} Printable version of the game board
   */
  public prettyPrint(): string {
    let rows: Array<Array<string>> = [];
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

  /**
   * Return a new UTTT board as a copy of this one
   * @returns {UTTT} Copy of the current game
   */
  public copy(): UTTT {
    const copy = new UTTT(this.size);
    copy.board = clone(this.board);
    copy.moves = this.moves;
    copy.winner = this.winner;
    copy.nextBoard = this.nextBoard;
    copy.stateBoard = clone(this.stateBoard);
    return copy;
  }
}
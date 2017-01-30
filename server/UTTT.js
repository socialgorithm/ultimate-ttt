import TicTacToe from 'model/TicTacToe';
import errors from './errors';

/**
 * Ultimate Tic Tac Game
 */
export default class UTTT {
  constructor(size = 3){
    this.size = size;
    this.init();

    this.maxMoves = Math.pow(this.size, 4);

    return this;
  }

  /**
   * Initialize the game
   */
  init(){
    // Game state
    this.moves = 0;
    this.nextBoard = null;
    this.winner = -1;
    this.board = [];

    for(let x = 0; x < this.size; x++){
      this.board[x] = [];
      for(let y = 0; y < this.size; y++){
        this.board[x][y] = new TicTacToe(this.size);
      }
    }
  }

  /**
   * Returns true if the game is over
   */
  isFinished(){
    return (this.winner > -1 || this.moves === this.maxMoves);
  }

  /**
   * Execute a move
   * @param player Player identifier (1 || 2)
   * @param board Board coordinates as an array [x, y]
   * @param move Move coordinates as an array [x, y]
   */
  move(player, board, move){
    if(this.isFinished()) {
      throw new Error(errors.gameFinished, 1);
    }

    if (!this.isValidPlayer(player)) {
      throw new Error(errors.player, 2);
    }

    if(this.nextBoard && this.nextBoard !== board){
      throw new Error(errors.board, 6);
    }

    if (!this.isValidMove(move)) {
      throw new Error(errors.move, 3);
    }

    if (this.board[move[0]][move[1]] > 0) {
      throw new Error(errors.repeat, 4);
    }

    this.board[move[0]][move[1]] = player;
    this.moves++;

    this.checkRow(move[0]);
    this.checkColumn(move[1]);

    this.checkLtRDiagonal();
    this.checkRtLDiagonal();

    if (this.isFinished() && this.winner < 0){
      this.winner = 0;
    }
  }
}
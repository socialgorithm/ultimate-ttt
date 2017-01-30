import TicTacToe from './model/TicTacToe';
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

    // The state board holds the ultimate game state
    this.stateBoard = new TicTacToe(this.size);

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
    return (this.stateBoard.isFinished() || this.moves === this.maxMoves);
  }

  /**
   * Execute a move
   * @param player Player identifier (1 || 2)
   * @param board Board coordinates as an array [x, y]
   * @param move Move coordinates as an array [x, y]
   */
  move(board, player, move){
    if(this.isFinished()) {
      throw new Error(errors.gameFinished, 1);
    }

    if(!this.isValidBoard(board)){
      throw new Error(errors.board, 6);
    }

    this.board[board[0]][board[1]].move(player, move);
    this.moves++;

    this.nextBoard = move;

    // Update the game board state
    if(this.board[board[0]][board[1]].isFinished()){
      this.stateBoard.move(
        this.board[board[0]][board[1]].winner,
        board
      );
    }

    this.winner = this.stateBoard.winner;
  }

  /**
   * Validates a board
   * @param board Board coordinates as an array [x, y]
   * @returns {boolean}
   */
  isValidBoard(board){
    if(!this.nextBoard){
      return !(
        !Array.isArray(board) ||
        board.length !== 2 ||
        board[0] < 0 ||
        board[0] > this.size ||
        board[1] < 0 ||
        board[1] > this.size ||
        typeof(this.board[board[0]][board[1]]) === 'undefined'
      );
    }else{
      return this.nextBoard[0] === board[0] &&
             this.nextBoard[1] === board[1];
    }
  }

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
}
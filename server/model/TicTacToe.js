import errors from '../errors';

/**
 * TicTacToe board implementation
 * Players must be indicated with 1 or 2
 * Moves with an array of [x, y]
 */
export default class TicTacToe {
  constructor(size = 3){
    this.size = size;
    this.init();

    this.maxMoves = Math.pow(this.size, 2);

    return this;
  }

  init(){
    this.board = [];
    this.moves = 0;
    this.winner = -1;

    for(let x = 0; x < this.size; x++){
      this.board[x] = [];
      for(let y = 0; y < this.size; y++){
        this.board[x][y] = 0;
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
   * @param move Move coordinates as an array [x, y]
   */
  move(player, move){
    if(this.isFinished()) {
      throw new Error(errors.boardFinished, 1);
    }

    if (!this.isValidPlayer(player)) {
      throw new Error(errors.player, 2);
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

  /**
   * Validates a player
   * @param player Player identifier (1 || 2)
   * @returns {boolean}
   */
  isValidPlayer(player){
    return !(!player || !Number.isInteger(player) || player < 1 || player > 2);
  }

  /**
   * Validates a move
   * @param move Move coordinates as an array [x, y]
   * @returns {boolean}
   */
  isValidMove(move){
    return !(
      !Array.isArray(move) ||
      move.length !== 2 ||
      move[0] < 0 ||
      move[0] > this.size ||
      move[1] < 0 ||
      move[1] > this.size ||
      typeof(this.board[move[0]][move[1]]) === 'undefined'
    );
  }

  checkRow(row){
    const player = this.board[row][0];
    if(player === 0){
      return;
    }
    for(let i = 1; i < this.size; i++){
      if(player !== this.board[row][i]) {
        return;
      }
    }
    this.winner = player;
  }

  checkColumn(col){
    const player = this.board[0][col];
    if(player === 0){
      return;
    }
    for(let i = 1; i < this.size; i++){
      if(player !== this.board[i][col]) {
        return;
      }
    }
    this.winner = player;
  }

  checkLtRDiagonal(){
    const player = this.board[0][0];
    if(player === 0){
      return;
    }
    for(let i = 1; i < this.size; i++){
      if(player !== this.board[i][i]){
        return;
      }
    }
    this.winner = player;
  }

  checkRtLDiagonal(){
    const player = this.board[0][this.size - 1];
    if(player === 0){
      return;
    }
    for(let i = this.size - 1; i >= 0; i--){
      if(player !== this.board[this.size - 1 - i][i]){
        return;
      }
    }
    this.winner = player;
  }

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
}
const UTTT = require('ultimate-ttt');

/**
 * Random client implementation of the UTTT Game
 */

class Random{
  constructor(player, size = 3){
    if(!player || !Number.isInteger(player) || player < 1 || player > 2){
      throw new Error('Invalid player');
    }

    this.size = size;
    this.player = player;
    this.oponent = 3 - player;

    this.init();
  }

  /* ----- Required methods ----- */

  init(){
    this.game = new UTTT(this.size);
  }

  addOpponentMove(board, move){
    this.game.move(board, this.oponent, move);
  }

  addMove(board, move){
    this.game.move(board, this.player, move);
  }

  getMove(){
    const boardCoords = this.chooseBoard();
    const board = this.game.board[boardCoords[0]][boardCoords[1]];
    const move = this.findRandomPosition(board);

    return {
      board: boardCoords,
      move: move
    };
  }

  /* ---- Non required methods ----- */

  /**
   * Choose a valid board to play in
   * @returns {[number,number]} Board identifier [row, col]
   */
  chooseBoard(){
    let board = this.game.nextBoard || [0, 0];

    if(!this.game.board[board[0]][board[1]].isFinished()){
      return board;
    }

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if(!this.game.board[x][y].isFinished()){
          return [x, y];
        }
      }
    }

    // Won't happen during normal game states
    // if this is reached it means that the game state has been
    // altered incorrectly
    throw new Error('Error: Unable to find available board');
  }

  /**
   * Get a random valid coordinate
   * @returns {number} Coordinate in the range [0, this.size - 1]
   */
  getRandomCoordinate(){
    return Math.round(Math.random() * (this.size - 1));
  }

  /**
   * Get a random position to play in a board
   * @param board Board identifier [row, col]
   * @returns {[number,number]} Position coordinates [row, col]
   */
  findRandomPosition(board){
    let valid = false;
    while(!valid){
      let move = [
        this.getRandomCoordinate(),
        this.getRandomCoordinate(),
      ];
      if(board.isValidMove(move) && board.board[move[0]][move[1]] === 0){
        valid = move;
      }
    }
    return valid;
  }
}

module.exports = Random;
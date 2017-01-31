const UTTT = require('ultimate-ttt');

/**
 * Random client implementation of the UTTT Game
 */

class Random{
  constructor(player, size = 3){
    if(!player || player < 1 || player > 2){
      throw new Error('Invalid player');
    }

    this.size = size;
    this.player = player;
    this.oponent = 3 - player;

    this.init();
  }

  init(){
    this.game = new UTTT(this.size);
  }

  addOponentMove(board, move){
    this.game.move(board, this.oponent, move);
  }

  addMove(board, move){
    this.game.move(board, this.player, move);
  }

  findRandomPosition(board){
    let valid = false;
    while(!valid){
      let move = [
        Math.round(Math.random() * (this.size - 1)),
        Math.round(Math.random() * (this.size - 1)),
      ];
      if(board.isValidMove(move) && board.board[move[0]][move[1]] === 0){
        valid = move;
      }
    }
    return valid;
  }

  getMove(){
    const boardCoords = this.game.nextBoard || [0, 0];
    const board = this.game.board[boardCoords[0]][boardCoords[1]];
    const move = this.findRandomPosition(board);

    return {
      board: boardCoords,
      move: move
    };
  }
}

module.exports = Random;
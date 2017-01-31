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

  init(){
    this.game = new UTTT(this.size);
  }

  addOponentMove(board, move){
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

  chooseBoard(){
    let board = this.game.nextBoard || [0, 0];

    while(this.game.board[board[0]][board[1]].isFinished()){
      board = [this.getRandomCoordinate(), this.getRandomCoordinate()];
    }

    return board;
  }

  getRandomCoordinate(){
    return Math.round(Math.random() * (this.size - 1));
  }

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
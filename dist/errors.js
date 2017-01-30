'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const errors = {
  player: 'Invalid player, it must be either 1 or 2',
  move: 'Invalid move coordinates, they must be an array in the form [x, y]',
  repeat: 'Position already played',
  board: 'Invalid next board, it must be the same as the last valid move\'s coordinates',
  boardFinished: 'Board already finished',
  gameFinished: 'Game already finished'
};

exports.default = errors;
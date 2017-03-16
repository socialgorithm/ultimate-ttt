'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var errors = {
  player: {
    message: 'Invalid player (%s), it must be either 0 or 1',
    code: 1
  },
  move: {
    message: 'Invalid move coordinates (%s)',
    code: 2
  },
  board: {
    message: 'Invalid next board (%s), it must be the same as the last valid move\'s coordinates',
    code: 4
  },
  boardFinished: {
    message: 'Board already finished',
    code: 5
  },
  gameFinished: {
    message: 'Game already finished',
    code: 6
  },
  gameNotFinished: {
    message: 'Game not finished',
    code: 7
  }
};

exports.default = errors;
module.exports = exports['default'];
//# sourceMappingURL=errors.js.map
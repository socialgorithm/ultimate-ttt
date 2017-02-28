'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TicTacToe = require('./model/TicTacToe');

var _TicTacToe2 = _interopRequireDefault(_TicTacToe);

var _errors = require('./model/errors');

var _errors2 = _interopRequireDefault(_errors);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Ultimate Tic Tac Game
 */
var UTTT = function () {
  function UTTT() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

    _classCallCheck(this, UTTT);

    this.size = size;
    this.init();

    this.maxMoves = Math.pow(this.size, 4);

    return this;
  }

  /**
   * Initialize the game
   */


  _createClass(UTTT, [{
    key: 'init',
    value: function init() {
      // Game state
      this.moves = 0;
      this.nextBoard = null;
      this.winner = -1;
      this.board = [];

      // The state board holds the ultimate game state
      this.stateBoard = new _TicTacToe2.default(this.size);

      for (var x = 0; x < this.size; x++) {
        this.board[x] = [];
        for (var y = 0; y < this.size; y++) {
          this.board[x][y] = new _TicTacToe2.default(this.size);
        }
      }
    }

    /**
     * Returns true if the game is over
     */

  }, {
    key: 'isFinished',
    value: function isFinished() {
      return this.stateBoard.isFinished() || this.moves === this.maxMoves;
    }

    /**
     * Execute a move
     * @param player Player identifier (1 || 2)
     * @param board Board coordinates as an array [x, y]
     * @param move Move coordinates as an array [x, y]
     */

  }, {
    key: 'move',
    value: function move(board, player, _move) {
      if (this.isFinished()) {
        throw (0, _error2.default)(_errors2.default.gameFinished);
      }

      board[0] = parseInt(board[0], 10);
      board[1] = parseInt(board[1], 10);

      _move[0] = parseInt(_move[0], 10);
      _move[1] = parseInt(_move[1], 10);

      if (!this.isValidBoard(board)) {
        throw (0, _error2.default)(_errors2.default.board, board);
      }

      this.board[board[0]][board[1]].move(player, _move);

      this.moves++;

      this.nextBoard = _move;
      if (this.board[this.nextBoard[0]][this.nextBoard[1]].isFinished()) {
        this.nextBoard = false;
      }

      // Update the game board state
      if (this.board[board[0]][board[1]].isFinished() && !this.stateBoard.isPlayedMove(board) && this.board[board[0]][board[1]].winner > 0) {
        this.stateBoard.move(this.board[board[0]][board[1]].winner, board);
      }

      this.winner = this.stateBoard.winner;
    }

    /**
     * Validates a board before playing it
     * @param board Board coordinates as an array [x, y]
     * @returns {boolean} true if the board is playable
     */

  }, {
    key: 'isValidBoard',
    value: function isValidBoard(board) {
      if (!this.nextBoard) {
        return !(!Array.isArray(board) || board.length !== 2 || board[0] < 0 || board[0] > this.size || board[1] < 0 || board[1] > this.size || typeof this.board[board[0]][board[1]] === 'undefined');
      } else {
        return Array.isArray(board) && this.nextBoard[0] === board[0] && this.nextBoard[1] === board[1];
      }
    }
  }, {
    key: 'prettyPrint',
    value: function prettyPrint() {
      var rows = [];
      for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {
          var small = this.board[x][y].prettyPrint().split("\n");

          for (var row = 0; row < this.size; row++) {
            var xCoord = x * this.size + row;
            if (!rows[xCoord]) {
              rows[xCoord] = [];
            }
            rows[xCoord][y] = small[row];
          }
        }
      }
      var ret = [];
      for (var _x2 = 0; _x2 < rows.length; _x2++) {
        ret.push(rows[_x2].join('| '));
        if ((_x2 + 1) % this.size === 0) {
          var sepChars = '';
          for (var i = 0; i < this.size * 2; i++) {
            sepChars += '-';
          }
          sepChars += '+';
          var sep = sepChars;
          for (var _i = 1; _i < this.size; _i++) {
            sep += '-' + sepChars;
          }
          ret.push(sep.substr(0, sep.length - 1));
        }
      }
      return ret.join("\n");
    }
  }]);

  return UTTT;
}();

exports.default = UTTT;
module.exports = exports['default'];
//# sourceMappingURL=UTTT.js.map
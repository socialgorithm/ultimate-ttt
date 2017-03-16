'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SubBoard = require('./model/SubBoard');

var _SubBoard2 = _interopRequireDefault(_SubBoard);

var _errors = require('./model/errors');

var _errors2 = _interopRequireDefault(_errors);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * UTTT MainBoard Class
 * Implements a functional/immutable API
 *
 * Docs: https://github.com/socialgorithm/ultimate-ttt-js/wiki
 */
var UTTT = function () {
  function UTTT() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

    _classCallCheck(this, UTTT);

    this.size = size;
    this.maxMoves = Math.pow(this.size, 4);

    this._init();

    return this;
  }

  /* --------- Public API --------- */

  /**
   * Returns true if the game is over
   */


  _createClass(UTTT, [{
    key: 'isFinished',
    value: function isFinished() {
      return this.stateBoard.isFinished() || this.moves === this.maxMoves;
    }

    /**
     * Returns the winner for the game, throws an exception if the game hasn't finished yet.
     * @returns {number} -1 for a tie, 0 you won, 1 opponent won
     */

  }, {
    key: 'getResult',
    value: function getResult() {
      return this.stateBoard.getResult();
    }

    /**
     * Validates a board selection before playing it
     * @param boardRowCol Board coordinates as an array [row, col]
     * @returns {boolean} true if the board is playable
     */

  }, {
    key: 'isValidBoardRowCol',
    value: function isValidBoardRowCol(boardRowCol) {
      if (!this.nextBoard) {
        return !(!Array.isArray(boardRowCol) || boardRowCol.length !== 2 || boardRowCol[0] < 0 || boardRowCol[0] > this.size || boardRowCol[1] < 0 || boardRowCol[1] > this.size || typeof this.board[boardRowCol[0]][boardRowCol[1]] === 'undefined');
      } else {
        return Array.isArray(boardRowCol) && this.nextBoard[0] === boardRowCol[0] && this.nextBoard[1] === boardRowCol[1];
      }
    }

    /**
     * Validates a given board & move combination (check for right format, data ranges, and
     * that the move hasn't already been played)
     * @param boardRowCol Board coordinates [row, col]
     * @param move Move coordinates [row, col]
     * @returns {boolean} true if the move is valid
     */

  }, {
    key: 'isValidMove',
    value: function isValidMove(boardRowCol, move) {
      if (!this.isValidBoardRowCol(boardRowCol)) {
        return false;
      }
      return this.board[boardRowCol[0]][boardRowCol[1]].isValidMove(move);
    }

    /**
     * Adds your move to the board, throws exception if move is invalid or board is already finished.
     * @param boardRowCol
     * @param move
     * @returns {UTTT}
     */

  }, {
    key: 'addMyMove',
    value: function addMyMove(boardRowCol, move) {
      return this._move(boardRowCol, _SubBoard.ME, move);
    }

    /**
     * Adds an opponent move to the board, throws exception if move is invalid or board is already finished.
     * @param boardRowCol
     * @param move
     * @returns {UTTT}
     */

  }, {
    key: 'addOpponentMove',
    value: function addOpponentMove(boardRowCol, move) {
      return this._move(boardRowCol, _SubBoard.OPPONENT, move);
    }

    /**
     * Returns a string with the board formatted for display
     * including new lines.
     * @returns {string}
     */

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

    /* --------- Private API --------- */

    /**
     * Initialize the game
     * @private
     */

  }, {
    key: '_init',
    value: function _init() {
      // Game state
      this.board = [];
      this.moves = 0;
      this.winner = _SubBoard.RESULT_TIE - 1;
      this.nextBoard = null;

      // The state board holds the ultimate game state
      this.stateBoard = new _SubBoard2.default(this.size);

      for (var x = 0; x < this.size; x++) {
        this.board[x] = [];
        for (var y = 0; y < this.size; y++) {
          this.board[x][y] = new _SubBoard2.default(this.size);
        }
      }
    }

    /**
     * Return a new UTTT board as a copy of this one
     * @returns {UTTT} Copy of the current game
     * @private
     */

  }, {
    key: '_copy',
    value: function _copy() {
      var copy = new UTTT(this.size);
      copy._init();
      copy.board = this.board;
      copy.moves = this.moves;
      copy.winner = this.winner;
      copy.nextBoard = this.nextBoard;
      copy.stateBoard = this.stateBoard;
      return copy;
    }

    /**
     * Execute a move
     * @param player Player identifier (1 || 2)
     * @param board Board coordinates as an array [x, y]
     * @param move Move coordinates as an array [x, y]
     * @returns {UTTT} Updated copy of the current game with the move added and the state updated
     * @private
     */

  }, {
    key: '_move',
    value: function _move(board, player, move) {
      if (this.isFinished()) {
        throw (0, _error2.default)(_errors2.default.gameFinished);
      }

      // Make sure we're dealing with ints
      board[0] = parseInt(board[0], 10);
      board[1] = parseInt(board[1], 10);

      move[0] = parseInt(move[0], 10);
      move[1] = parseInt(move[1], 10);

      if (!this.isValidBoardRowCol(board)) {
        throw (0, _error2.default)(_errors2.default.board, board);
      }

      if (!this.isValidMove(board, move)) {
        throw (0, _error2.default)(_errors2.default.move, move);
      }

      var game = this._copy();
      var updatedBoard = void 0;

      if (player === _SubBoard.ME) {
        updatedBoard = this.board[board[0]][board[1]].addMyMove(move, game.moves);
      } else if (player === _SubBoard.OPPONENT) {
        updatedBoard = this.board[board[0]][board[1]].addOpponentMove(move, game.moves);
      } else {
        throw (0, _error2.default)(_errors2.default.player, player);
      }

      // update the copy
      game.board[board[0]][board[1]] = updatedBoard;
      game.moves++;

      game.nextBoard = move;
      if (game.board[game.nextBoard[0]][game.nextBoard[1]].isFinished()) {
        game.nextBoard = false;
      }

      // Update the game board state
      if (game.board[board[0]][board[1]].isFinished() && game.board[board[0]][board[1]].winner >= _SubBoard.RESULT_TIE) {
        game.stateBoard = game.stateBoard._move(game.board[board[0]][board[1]].winner, board);
      }

      game.winner = game.stateBoard.winner;
      return game;
    }
  }]);

  return UTTT;
}();

exports.default = UTTT;
module.exports = exports['default'];
//# sourceMappingURL=UTTT.js.map
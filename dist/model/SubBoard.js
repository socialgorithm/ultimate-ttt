'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESULT_LOSE = exports.RESULT_WIN = exports.RESULT_TIE = exports.OPPONENT = exports.ME = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

var _error = require('../error');

var _error2 = _interopRequireDefault(_error);

var _Cell = require('./Cell');

var _Cell2 = _interopRequireDefault(_Cell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ME = exports.ME = 0;
var OPPONENT = exports.OPPONENT = 1;

var RESULT_TIE = exports.RESULT_TIE = -1;
var RESULT_WIN = exports.RESULT_WIN = 0;
var RESULT_LOSE = exports.RESULT_LOSE = 1;

/**
 * SubBoard for TicTacToe games
 * This class implements the traditional game of TicTacToe
 *
 * Docs: https://github.com/socialgorithm/ultimate-ttt-js/wiki
 */

var SubBoard = function () {
  function SubBoard() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

    _classCallCheck(this, SubBoard);

    this.size = size;
    this._init();

    // the maximum number of moves before filling up the board
    this.maxMoves = Math.pow(this.size, 2);

    return this;
  }

  /* --------- Public API --------- */

  /**
   * Returns true if the game is over
   */


  _createClass(SubBoard, [{
    key: 'isFinished',
    value: function isFinished() {
      return this.winner >= RESULT_TIE;
    }

    /**
     * Returns the winner for the game, throws an exception if the game hasn't finished yet.
     * @returns {number} -1 for a tie, 0 you won, 1 opponent won
     */

  }, {
    key: 'getResult',
    value: function getResult() {
      if (!this.isFinished()) {
        throw (0, _error2.default)(_errors2.default.gameNotFinished);
      }
      return this.winner;
    }

    /**
     * Validates a given move (check for right format, data ranges, and
     * that the move hasn't already been played)
     * @param move Move coordinates as an array [x, y]
     * @returns {boolean} true if the move is valid
     */

  }, {
    key: 'isValidMove',
    value: function isValidMove(move) {
      return !(!Array.isArray(move) || move.length !== 2 || move[0] < 0 || move[0] > this.size || move[1] < 0 || move[1] > this.size || typeof this.board[move[0]][move[1]] === 'undefined' || this.board[move[0]][move[1]].player >= ME);
    }

    /**
     * Adds your move to the board, throws exception if move is invalid or board is already finished.
     * @param move move coordinates
     * @param index which turn this was (to enable replaying UTTT games)
     * @returns {SubBoard}
     */

  }, {
    key: 'addMyMove',
    value: function addMyMove(move) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

      return this._move(ME, move, index);
    }

    /**
     * Adds an opponent move to the board, throws exception if move is invalid or board is already finished.
     * @param move
     * @param index which turn this was (to enable replaying UTTT games)
     * @returns {SubBoard}
     */

  }, {
    key: 'addOpponentMove',
    value: function addOpponentMove(move) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

      return this._move(OPPONENT, move, index);
    }

    /**
     * Returns a string with the board formatted for display
     * including new lines.
     * @returns {string}
     */

  }, {
    key: 'prettyPrint',
    value: function prettyPrint() {
      var ret = [];
      for (var x = 0; x < this.size; x++) {
        var line = '';
        for (var y = 0; y < this.size; y++) {
          var player = this.board[x][y].player < 0 ? '-' : this.board[x][y].player;
          line += player + ' ';
        }
        ret.push(line);
      }
      return ret.join("\n");
    }

    /* --------- Private API --------- */

    /**
     * Initialise the game
     * In normal usage you should create a new SubBoard object for this
     * but sometimes it may be useful to reset the current instance.
     * @private
     */

  }, {
    key: '_init',
    value: function _init() {
      this.board = [];
      this.moves = 0;
      this.winner = RESULT_TIE - 1;

      for (var x = 0; x < this.size; x++) {
        this.board[x] = [];
        for (var y = 0; y < this.size; y++) {
          this.board[x][y] = new _Cell2.default();
        }
      }
    }

    /**
     * Return a new SubBoard as a copy of this one
     * @returns {SubBoard} Copy of the current game
     * @private
     */

  }, {
    key: '_copy',
    value: function _copy() {
      var copy = new SubBoard(this.size);
      copy._init();
      copy.board = this.board;
      copy.moves = this.moves;
      copy.winner = this.winner;
      return copy;
    }

    /**
     * Execute a move. This is an immutable method, that returns a
     * new SubBoard.
     * @param player Player identifier (0 || 1)
     * @param move Move coordinates as an array [x, y]
     * @param index which turn this was (to enable replaying UTTT games)
     * @returns {SubBoard} Updated copy of the current game with the move added and the state updated
     * @private
     */

  }, {
    key: '_move',
    value: function _move(player, move) {
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

      if (this._isFull() || this.isFinished()) {
        throw (0, _error2.default)(_errors2.default.boardFinished);
      }

      if (!this._isValidPlayer(player)) {
        throw (0, _error2.default)(_errors2.default.player, player);
      }

      if (!this.isValidMove(move)) {
        throw (0, _error2.default)(_errors2.default.move, move);
      }
      var game = this._copy();

      game.board[move[0]][move[1]].player = player;
      game.board[move[0]][move[1]].subBoardIndex = game.moves;
      game.board[move[0]][move[1]].mainIndex = index;
      game.moves++;

      // Check if the board has been won
      game._checkRow(move[0]);

      if (!game.isFinished()) {
        game._checkColumn(move[1]);
      }

      if (!game.isFinished()) {
        game._checkLtRDiagonal();
      }

      if (!game.isFinished()) {
        game._checkRtLDiagonal();
      }

      // check for a tie
      if (game._isFull() && game.winner < RESULT_TIE) {
        game.winner = RESULT_TIE;
      }

      return game;
    }

    /**
     * Validates a player
     * @param player Player identifier (0 || 1)
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isValidPlayer',
    value: function _isValidPlayer(player) {
      return [ME, OPPONENT].indexOf(player) > -1;
    }

    /**
     * Check if a given row has been won
     * @param row Row index
     * @private
     */

  }, {
    key: '_checkRow',
    value: function _checkRow(row) {
      var player = this.board[row][0].player;
      if (player < ME) {
        return;
      }
      for (var i = 1; i < this.size; i++) {
        if (player !== this.board[row][i].player) {
          return;
        }
      }
      if (player >= ME) {
        this.winner = player;
      }
    }

    /**
     * Check if a given column has been won
     * @param col Column index
     * @private
     */

  }, {
    key: '_checkColumn',
    value: function _checkColumn(col) {
      var player = this.board[0][col].player;
      if (player < ME) {
        return;
      }
      for (var i = 1; i < this.size; i++) {
        if (player !== this.board[i][col].player) {
          return;
        }
      }
      if (player >= ME) {
        this.winner = player;
      }
    }

    /**
     * Check if the left to right diagonal has been won
     * @private
     */

  }, {
    key: '_checkLtRDiagonal',
    value: function _checkLtRDiagonal() {
      var player = this.board[0][0].player;
      if (player < ME) {
        return;
      }
      for (var i = 1; i < this.size; i++) {
        if (player !== this.board[i][i].player) {
          return;
        }
      }
      if (player >= ME) {
        this.winner = player;
      }
    }

    /**
     * Check if the right to left diagonal has been won
     * @private
     */

  }, {
    key: '_checkRtLDiagonal',
    value: function _checkRtLDiagonal() {
      var player = this.board[0][this.size - 1].player;
      if (player < ME) {
        return;
      }
      for (var i = this.size - 1; i >= 0; i--) {
        if (player !== this.board[this.size - 1 - i][i].player) {
          return;
        }
      }
      if (player >= ME) {
        this.winner = player;
      }
    }

    /**
     * Check if the board is full
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isFull',
    value: function _isFull() {
      return this.moves === this.maxMoves;
    }
  }]);

  return SubBoard;
}();

exports.default = SubBoard;
//# sourceMappingURL=SubBoard.js.map
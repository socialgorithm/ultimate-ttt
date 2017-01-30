'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errors = require('../errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * TicTacToe board implementation
 * Players must be indicated with 1 or 2
 * Moves with an array of [x, y]
 */
var TicTacToe = function () {
  function TicTacToe() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

    _classCallCheck(this, TicTacToe);

    this.size = size;
    this.init();

    this.maxMoves = Math.pow(this.size, 2);

    return this;
  }

  _createClass(TicTacToe, [{
    key: 'init',
    value: function init() {
      this.board = [];
      this.moves = 0;
      this.winner = -1;

      for (var x = 0; x < this.size; x++) {
        this.board[x] = [];
        for (var y = 0; y < this.size; y++) {
          this.board[x][y] = 0;
        }
      }
    }

    /**
     * Returns true if the game is over
     */

  }, {
    key: 'isFinished',
    value: function isFinished() {
      return this.winner > -1 || this.moves === this.maxMoves;
    }

    /**
     * Execute a move
     * @param player Player identifier (1 || 2)
     * @param move Move coordinates as an array [x, y]
     */

  }, {
    key: 'move',
    value: function move(player, _move) {
      if (this.isFinished()) {
        throw new Error(_errors2.default.boardFinished, 1);
      }

      if (!this.isValidPlayer(player)) {
        throw new Error(_errors2.default.player, 2);
      }

      if (!this.isValidMove(_move)) {
        throw new Error(_errors2.default.move, 3);
      }

      if (this.board[_move[0]][_move[1]] > 0) {
        throw new Error(_errors2.default.repeat, 4);
      }

      this.board[_move[0]][_move[1]] = player;
      this.moves++;

      this.checkRow(_move[0]);
      this.checkColumn(_move[1]);

      this.checkLtRDiagonal();
      this.checkRtLDiagonal();

      if (this.isFinished() && this.winner < 0) {
        this.winner = 0;
      }
    }

    /**
     * Validates a player
     * @param player Player identifier (1 || 2)
     * @returns {boolean}
     */

  }, {
    key: 'isValidPlayer',
    value: function isValidPlayer(player) {
      return !(!player || !Number.isInteger(player) || player < 1 || player > 2);
    }

    /**
     * Validates a move
     * @param move Move coordinates as an array [x, y]
     * @returns {boolean}
     */

  }, {
    key: 'isValidMove',
    value: function isValidMove(move) {
      return !(!Array.isArray(move) || move.length !== 2 || move[0] < 0 || move[0] > this.size || move[1] < 0 || move[1] > this.size || typeof this.board[move[0]][move[1]] === 'undefined');
    }
  }, {
    key: 'checkRow',
    value: function checkRow(row) {
      var player = this.board[row][0];
      if (player === 0) {
        return;
      }
      for (var i = 1; i < this.size; i++) {
        if (player !== this.board[row][i]) {
          return;
        }
      }
      this.winner = player;
    }
  }, {
    key: 'checkColumn',
    value: function checkColumn(col) {
      var player = this.board[0][col];
      if (player === 0) {
        return;
      }
      for (var i = 1; i < this.size; i++) {
        if (player !== this.board[i][col]) {
          return;
        }
      }
      this.winner = player;
    }
  }, {
    key: 'checkLtRDiagonal',
    value: function checkLtRDiagonal() {
      var player = this.board[0][0];
      if (player === 0) {
        return;
      }
      for (var i = 1; i < this.size; i++) {
        if (player !== this.board[i][i]) {
          return;
        }
      }
      this.winner = player;
    }
  }, {
    key: 'checkRtLDiagonal',
    value: function checkRtLDiagonal() {
      var player = this.board[0][this.size - 1];
      if (player === 0) {
        return;
      }
      for (var i = this.size - 1; i >= 0; i--) {
        if (player !== this.board[this.size - 1 - i][i]) {
          return;
        }
      }
      this.winner = player;
    }
  }, {
    key: 'prettyPrint',
    value: function prettyPrint() {
      var ret = [];
      for (var x = 0; x < this.size; x++) {
        var line = '';
        for (var y = 0; y < this.size; y++) {
          line += this.board[x][y] + ' ';
        }
        ret.push(line);
      }
      return ret.join("\n");
    }
  }]);

  return TicTacToe;
}();

exports.default = TicTacToe;
module.exports = exports['default'];
//# sourceMappingURL=TicTacToe.js.map
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _UTTT = require('../UTTT');

var _UTTT2 = _interopRequireDefault(_UTTT);

var _errors = require('../model/errors');

var _errors2 = _interopRequireDefault(_errors);

var _SubBoard = require('../model/SubBoard');

var _error = require('../error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validateBoard(board, t) {
  t.true(Array.isArray(board));

  board.forEach(function (row) {
    t.true(Array.isArray(row));
    row.forEach(function (cell) {
      t.is(cell.winner, _SubBoard.RESULT_TIE - 1);
    });
  });
}

(0, _ava2.default)('Returns a valid UTTT model', function (t) {
  var game = new _UTTT2.default();

  t.is(typeof game === 'undefined' ? 'undefined' : _typeof(game), 'object');
  t.is(_typeof(game.isFinished), 'function');
  t.is(_typeof(game.getResult), 'function');
  t.is(_typeof(game.isValidMove), 'function');
  t.is(_typeof(game.addMyMove), 'function');
  t.is(_typeof(game.addOpponentMove), 'function');
  t.is(_typeof(game.prettyPrint), 'function');

  validateBoard(game.board, t);
});

(0, _ava2.default)('Moves correctly update the board', function (t) {
  var game = new _UTTT2.default();

  game = game.addMyMove([1, 0], [0, 0]);
  game = game.addOpponentMove([0, 0], [2, 1]);
  game = game.addMyMove([2, 1], [1, 0]);
  game = game.addOpponentMove([1, 0], [0, 1]);

  t.is(game.board[1][0].board[0][0].player, _SubBoard.ME);
  t.is(game.board[1][0].board[0][0].mainIndex, 0);
  t.is(game.board[1][0].board[0][0].subBoardIndex, 0);

  t.is(game.board[0][0].board[2][1].player, _SubBoard.OPPONENT);
  t.is(game.board[0][0].board[2][1].mainIndex, 1);
  t.is(game.board[0][0].board[2][1].subBoardIndex, 0);

  t.is(game.board[2][1].board[1][0].player, _SubBoard.ME);
  t.is(game.board[2][1].board[1][0].mainIndex, 2);
  t.is(game.board[2][1].board[1][0].subBoardIndex, 0);

  t.is(game.board[1][0].board[0][1].player, _SubBoard.OPPONENT);
  t.is(game.board[1][0].board[0][1].mainIndex, 3);
  t.is(game.board[1][0].board[0][1].subBoardIndex, 1);
});

(0, _ava2.default)('Move rejects moves to the wrong board', function (t) {
  var game = new _UTTT2.default();

  game = game.addMyMove([1, 0], [0, 0]);

  t.throws(function () {
    game.addOpponentMove([2, 0], [2, 1]);
  }, (0, _error2.default)(_errors2.default.board, [2, 0]).message);
});

(0, _ava2.default)('Move rejects invalid moves', function (t) {
  var game = new _UTTT2.default();

  t.throws(function () {
    game.addMyMove([0, 0], [-1, 0]);
  }, (0, _error2.default)(_errors2.default.move, [-1, 0]).message);

  t.throws(function () {
    game.addMyMove([-1, 0], [-1, 1]);
  }, (0, _error2.default)(_errors2.default.board, [-1, 0]).message);
});

(0, _ava2.default)('isValidMove returns false on invalid board/move', function (t) {
  var game = new _UTTT2.default();

  t.true(game.isValidMove([0, 0], [0, 0]));
  t.false(game.isValidMove([-1, 0], [0, 0]));
  t.false(game.isValidMove([1, 0], [-1, 0]));
});

(0, _ava2.default)('_move fails on invalid player', function (t) {
  var game = new _UTTT2.default();

  t.throws(function () {
    game._move([0, 0], -1, [1, 0]);
  }, (0, _error2.default)(_errors2.default.player, -1).message);
});

(0, _ava2.default)('Detect game ending', function (t) {
  var game = new _UTTT2.default();

  // Win [0, 0]
  game = game.addMyMove([0, 0], [0, 0]);
  game = game.addMyMove([0, 0], [1, 0]);
  game = game.addMyMove([1, 0], [0, 0]);
  game = game.addMyMove([0, 0], [2, 0]);

  // Win [1, 0]
  game = game.addMyMove([2, 0], [1, 0]);
  game = game.addMyMove([1, 0], [1, 0]);
  game = game.addMyMove([1, 0], [2, 0]);

  // Win [2, 0]
  game = game.addMyMove([2, 0], [2, 0]);
  game = game.addMyMove([2, 0], [0, 0]);

  t.true(game.isFinished());

  t.throws(function () {
    game.addMyMove([0, 0], [1, 1]);
  }, (0, _error2.default)(_errors2.default.gameFinished).message);

  t.is(game.getResult(), _SubBoard.ME);
});

(0, _ava2.default)('Move doesn\'t allow playing on already won boards', function (t) {
  var game = new _UTTT2.default();

  // Win [0, 0]
  game = game.addMyMove([0, 0], [0, 0]);
  game = game.addMyMove([0, 0], [1, 0]);
  game = game.addMyMove([1, 0], [0, 0]);
  game = game.addMyMove([0, 0], [2, 0]);
  game = game.addMyMove([2, 0], [0, 0]);

  t.false(game.isFinished());

  t.throws(function () {
    game.addMyMove([0, 0], [1, 1]);
  }, (0, _error2.default)(_errors2.default.boardFinished).message);
});

(0, _ava2.default)('Move allows any board after being sent to one that is won', function (t) {
  var game = new _UTTT2.default();

  // Fill [0, 0]
  game = game.addMyMove([0, 0], [0, 0]);
  game = game.addMyMove([0, 0], [1, 0]);
  game = game.addMyMove([1, 0], [0, 0]);
  game = game.addMyMove([0, 0], [2, 0]);

  t.notThrows(function () {
    game.addMyMove([2, 0], [0, 0]);
  });
});

(0, _ava2.default)('A tie in a board works properly', function (t) {
  var game = new _UTTT2.default();

  // Fill [0, 0]
  game = game.addMyMove([0, 0], [0, 0]);
  game = game.addOpponentMove([0, 0], [1, 0]);
  game = game.addMyMove([1, 0], [0, 0]);
  game = game.addOpponentMove([0, 0], [2, 0]);
  game = game.addMyMove([2, 0], [0, 0]);
  game = game.addOpponentMove([0, 0], [0, 1]);
  game = game.addMyMove([0, 1], [0, 0]);
  game = game.addOpponentMove([0, 0], [1, 1]);
  game = game.addMyMove([1, 1], [0, 0]);
  game = game.addOpponentMove([0, 0], [1, 2]);
  game = game.addMyMove([1, 2], [0, 0]);
  game = game.addOpponentMove([0, 2], [2, 1]);
  game = game.addMyMove([2, 1], [0, 0]);
  game = game.addOpponentMove([2, 2], [0, 2]);
  game = game.addMyMove([0, 2], [1, 1]);
  game = game.addOpponentMove([1, 1], [2, 2]);
  game = game.addMyMove([2, 2], [1, 2]);

  t.notThrows(function () {
    game.prettyPrint();
  });
});
//# sourceMappingURL=UTTT.test.js.map
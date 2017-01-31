'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _UTTT = require('../UTTT');

var _UTTT2 = _interopRequireDefault(_UTTT);

var _errors = require('../model/errors');

var _errors2 = _interopRequireDefault(_errors);

var _error = require('../error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validateBoard(board, t) {
  t.true(Array.isArray(board));

  board.forEach(function (row) {
    t.true(Array.isArray(row));
    row.forEach(function (cell) {
      t.is(cell.winner, -1);
    });
  });
}

(0, _ava2.default)('Returns a valid UTTT model', function (t) {
  var tic = new _UTTT2.default();

  t.is(typeof tic === 'undefined' ? 'undefined' : _typeof(tic), 'object');
  t.is(_typeof(tic.move), 'function');
  validateBoard(tic.board, t);
});

(0, _ava2.default)('Move correctly updates the board', function (t) {
  var tic = new _UTTT2.default();

  tic.move([1, 0], 1, [0, 0]);
  tic.move([0, 0], 2, [2, 1]);

  t.is(tic.board[1][0].board[0][0], 1);
  t.is(tic.board[0][0].board[2][1], 2);
});

(0, _ava2.default)('Move rejects moves to the wrong board', function (t) {
  var tic = new _UTTT2.default();

  tic.move([1, 0], 1, [0, 0]);

  t.throws(function () {
    tic.move([2, 0], 2, [2, 1]);
  }, (0, _error2.default)(_errors2.default.board, [2, 0]).message);
});

(0, _ava2.default)('Detect game ending', function (t) {
  var tic = new _UTTT2.default();

  // Win [0, 0]
  tic.move([0, 0], 1, [0, 0]);
  tic.move([0, 0], 1, [1, 0]);
  tic.move([1, 0], 1, [0, 0]);
  tic.move([0, 0], 1, [2, 0]);

  // Win [1, 0]
  tic.move([2, 0], 1, [1, 0]);
  tic.move([1, 0], 1, [1, 0]);
  tic.move([1, 0], 1, [2, 0]);

  // Win [2, 0]
  tic.move([2, 0], 1, [2, 0]);
  tic.move([2, 0], 1, [0, 0]);

  t.throws(function () {
    tic.move([0, 0], 1, [1, 1]);
  }, (0, _error2.default)(_errors2.default.gameFinished).message);

  t.notThrows(function () {
    tic.prettyPrint();
  });

  t.is(tic.winner, 1);
});

(0, _ava2.default)('Move allows playing on already won boards', function (t) {
  var tic = new _UTTT2.default();

  // Win [0, 0]
  tic.move([0, 0], 1, [0, 0]);
  tic.move([0, 0], 1, [1, 0]);
  tic.move([1, 0], 1, [0, 0]);
  tic.move([0, 0], 1, [2, 0]);
  tic.move([2, 0], 1, [0, 0]);

  t.notThrows(function () {
    tic.move([0, 0], 1, [1, 1]);
  });

  t.notThrows(function () {
    tic.prettyPrint();
  });
});

(0, _ava2.default)('Move allows any board after being sent to one that is won', function (t) {
  var tic = new _UTTT2.default();

  // Fill [0, 0]
  tic.move([0, 0], 1, [0, 0]);
  tic.move([0, 0], 1, [1, 0]);
  tic.move([1, 0], 1, [0, 0]);
  tic.move([0, 0], 1, [2, 0]);

  t.notThrows(function () {
    tic.move([2, 0], 1, [0, 0]);
  });
});
//# sourceMappingURL=UTTT.test.js.map
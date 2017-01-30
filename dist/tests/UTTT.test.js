'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _UTTT = require('../UTTT');

var _UTTT2 = _interopRequireDefault(_UTTT);

var _errors = require('../errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validateBoard(board, t) {
  t.true(Array.isArray(board));

  board.forEach(row => {
    t.true(Array.isArray(row));
    row.forEach(cell => {
      t.is(cell.winner, -1);
    });
  });
}

(0, _ava2.default)('Returns a valid UTTT model', t => {
  const tic = new _UTTT2.default();

  t.is(typeof tic, 'object');
  t.is(typeof tic.move, 'function');
  validateBoard(tic.board, t);
});

(0, _ava2.default)('Move correctly updates the board', t => {
  const tic = new _UTTT2.default();

  tic.move([1, 0], 1, [0, 0]);
  tic.move([0, 0], 2, [2, 1]);

  t.is(tic.board[1][0].board[0][0], 1);
  t.is(tic.board[0][0].board[2][1], 2);
});

(0, _ava2.default)('Move rejects moves to the wrong board', t => {
  const tic = new _UTTT2.default();

  tic.move([1, 0], 1, [0, 0]);

  t.throws(() => {
    tic.move([2, 0], 2, [2, 1]);
  }, _errors2.default.board);
});

(0, _ava2.default)('Detect game ending', t => {
  const tic = new _UTTT2.default();

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

  t.throws(() => {
    tic.move([0, 0], 1, [1, 1]);
  }, _errors2.default.gameFinished);

  t.notThrows(() => {
    tic.prettyPrint();
  });

  t.is(tic.winner, 1);
});
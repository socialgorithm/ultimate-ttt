'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _TicTacToe = require('../model/TicTacToe');

var _TicTacToe2 = _interopRequireDefault(_TicTacToe);

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
      t.true(cell >= 0);
      t.true(cell <= 2);
    });
  });
}

(0, _ava2.default)('Returns a valid TicTacToe model', function (t) {
  var tic = new _TicTacToe2.default();

  t.is(typeof tic === 'undefined' ? 'undefined' : _typeof(tic), 'object');
  t.is(_typeof(tic.move), 'function');
  validateBoard(tic.board, t);
});

(0, _ava2.default)('Move correctly updates the board', function (t) {
  var tic = new _TicTacToe2.default();

  tic.move(1, [0, 0]);
  tic.move(2, [2, 1]);

  t.deepEqual(tic.board, [[1, 0, 0], [0, 0, 0], [0, 2, 0]]);
});

(0, _ava2.default)('Move rejects invalid player', function (t) {
  var tic = new _TicTacToe2.default();

  t.throws(function () {
    tic.move(-1, 1);
  }, (0, _error2.default)(_errors2.default.player, '-1').message);
  t.throws(function () {
    tic.move('abc', 1);
  }, (0, _error2.default)(_errors2.default.player, 'abc').message);
  t.throws(function () {
    tic.move(0, 1);
  }, (0, _error2.default)(_errors2.default.player, '0').message);
  t.throws(function () {
    tic.move(3, 1);
  }, (0, _error2.default)(_errors2.default.player, '3').message);
});

(0, _ava2.default)('Move rejects invalid moves', function (t) {
  var tic = new _TicTacToe2.default();

  t.throws(function () {
    tic.move(1);
  }, (0, _error2.default)(_errors2.default.move).message);
  t.throws(function () {
    tic.move(1, 1);
  }, (0, _error2.default)(_errors2.default.move, 1).message);
  t.throws(function () {
    tic.move(1, 'abc');
  }, (0, _error2.default)(_errors2.default.move, 'abc').message);
  t.throws(function () {
    tic.move(1, []);
  }, (0, _error2.default)(_errors2.default.move, []).message);
  t.throws(function () {
    tic.move(1, [1]);
  }, (0, _error2.default)(_errors2.default.move, [1]).message);
  t.throws(function () {
    tic.move(1, [1, 4]);
  }, (0, _error2.default)(_errors2.default.move, [1, 4]).message);
  t.throws(function () {
    tic.move(1, [-1, 4]);
  }, (0, _error2.default)(_errors2.default.move, [-1, 4]).message);
  t.throws(function () {
    tic.move(1, [1, 1, 1]);
  }, (0, _error2.default)(_errors2.default.move, [1, 1, 1]).message);
});

(0, _ava2.default)('Move rejects repeated moves', function (t) {
  var tic = new _TicTacToe2.default();

  t.notThrows(function () {
    tic.move(1, [1, 1]);
  });
  t.throws(function () {
    tic.move(1, [1, 1]);
  }, (0, _error2.default)(_errors2.default.repeat, [1, 1]).message);
});

(0, _ava2.default)('Move rejects moves after finishing the game', function (t) {
  var tic = new _TicTacToe2.default();

  t.notThrows(function () {
    tic.move(1, [0, 0]);
  });
  t.notThrows(function () {
    tic.move(2, [0, 1]);
  });
  t.notThrows(function () {
    tic.move(1, [0, 2]);
  });
  t.notThrows(function () {
    tic.move(2, [1, 0]);
  });
  t.notThrows(function () {
    tic.move(2, [1, 1]);
  });
  t.notThrows(function () {
    tic.move(1, [1, 2]);
  });
  t.notThrows(function () {
    tic.move(1, [2, 0]);
  });
  t.notThrows(function () {
    tic.move(1, [2, 1]);
  });
  t.notThrows(function () {
    tic.move(2, [2, 2]);
  });

  t.throws(function () {
    tic.move(2, [1, 1]);
  }, (0, _error2.default)(_errors2.default.boardFinished).message);
});

(0, _ava2.default)('Can pretty print a board', function (t) {
  var tic = new _TicTacToe2.default();

  t.notThrows(function () {
    tic.prettyPrint();
  });
});

(0, _ava2.default)('Detect winning row', function (t) {
  var tic = new _TicTacToe2.default();

  t.notThrows(function () {
    tic.move(1, [0, 0]);
  });
  t.notThrows(function () {
    tic.move(2, [1, 1]);
  });
  t.notThrows(function () {
    tic.move(1, [0, 2]);
  });
  t.notThrows(function () {
    tic.move(2, [1, 0]);
  });
  t.notThrows(function () {
    tic.move(1, [0, 1]);
  });

  t.is(tic.winner, 1);
});

(0, _ava2.default)('Detect winning column', function (t) {
  var tic = new _TicTacToe2.default();

  t.notThrows(function () {
    tic.move(1, [0, 0]);
  });
  t.notThrows(function () {
    tic.move(2, [1, 1]);
  });
  t.notThrows(function () {
    tic.move(1, [2, 0]);
  });
  t.notThrows(function () {
    tic.move(2, [0, 1]);
  });
  t.notThrows(function () {
    tic.move(1, [1, 0]);
  });

  t.is(tic.winner, 1);
});

(0, _ava2.default)('Detect winning RtL diagonal', function (t) {
  var tic = new _TicTacToe2.default();

  t.notThrows(function () {
    tic.move(1, [0, 0]);
  });
  t.notThrows(function () {
    tic.move(2, [2, 1]);
  });
  t.notThrows(function () {
    tic.move(1, [1, 1]);
  });
  t.notThrows(function () {
    tic.move(2, [2, 0]);
  });
  t.notThrows(function () {
    tic.move(1, [2, 2]);
  });

  t.is(tic.winner, 1);
});

(0, _ava2.default)('Detect winning LtR diagonal', function (t) {
  var tic = new _TicTacToe2.default();

  t.notThrows(function () {
    tic.move(1, [2, 0]);
  });
  t.notThrows(function () {
    tic.move(2, [2, 1]);
  });
  t.notThrows(function () {
    tic.move(1, [1, 1]);
  });
  t.notThrows(function () {
    tic.move(2, [1, 0]);
  });
  t.notThrows(function () {
    tic.move(1, [0, 2]);
  });

  t.is(tic.winner, 1);
});
//# sourceMappingURL=TicTacToe.test.js.map
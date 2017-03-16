'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _SubBoard = require('../model/SubBoard');

var _SubBoard2 = _interopRequireDefault(_SubBoard);

var _Cell = require('../model/Cell');

var _Cell2 = _interopRequireDefault(_Cell);

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
      t.true(cell.player >= -1);
      t.true(cell.player <= 2);
      t.true(cell.subBoardIndex >= -1);
      t.true(cell.mainIndex >= -1);
    });
  });
}

(0, _ava2.default)('Returns a valid SubBoard model', function (t) {
  var subBoard = new _SubBoard2.default();

  t.is(typeof subBoard === 'undefined' ? 'undefined' : _typeof(subBoard), 'object');
  t.is(_typeof(subBoard.isFinished), 'function');
  t.is(_typeof(subBoard.getResult), 'function');
  t.is(_typeof(subBoard.isValidMove), 'function');
  t.is(_typeof(subBoard.addMyMove), 'function');
  t.is(_typeof(subBoard.addOpponentMove), 'function');
  t.is(_typeof(subBoard.prettyPrint), 'function');

  validateBoard(subBoard.board, t);
});

(0, _ava2.default)('getResult fails if unfinished', function (t) {
  var subBoard = new _SubBoard2.default();

  t.throws(function () {
    subBoard.getResult();
  }, (0, _error2.default)(_errors2.default.gameNotFinished).message);
});

(0, _ava2.default)('Move correctly updates the board', function (t) {
  var subBoard = new _SubBoard2.default();
  subBoard = subBoard.addMyMove([0, 0]);
  subBoard = subBoard.addOpponentMove([2, 1]);

  var emptyCell = new _Cell2.default();
  var myCell = new _Cell2.default(_SubBoard.ME, 0);
  var opponentCell = new _Cell2.default(_SubBoard.OPPONENT, 1);

  t.deepEqual(subBoard.board[0][0], myCell);
  t.deepEqual(subBoard.board[0][1], emptyCell);
  t.deepEqual(subBoard.board[0][2], emptyCell);
  t.deepEqual(subBoard.board[1][0], emptyCell);
  t.deepEqual(subBoard.board[1][1], emptyCell);
  t.deepEqual(subBoard.board[1][2], emptyCell);
  t.deepEqual(subBoard.board[2][0], emptyCell);
  t.deepEqual(subBoard.board[2][1], opponentCell);
  t.deepEqual(subBoard.board[2][2], emptyCell);
});

(0, _ava2.default)('Move rejects invalid player', function (t) {
  var subBoard = new _SubBoard2.default();

  t.throws(function () {
    subBoard._move(-1, 1);
  }, (0, _error2.default)(_errors2.default.player, '-1').message);
  t.throws(function () {
    subBoard._move('abc', 1);
  }, (0, _error2.default)(_errors2.default.player, 'abc').message);
  t.throws(function () {
    subBoard._move(3, 1);
  }, (0, _error2.default)(_errors2.default.player, '3').message);
});

(0, _ava2.default)('Move rejects invalid moves', function (t) {
  var subBoard = new _SubBoard2.default();

  t.throws(function () {
    subBoard._move(1);
  }, (0, _error2.default)(_errors2.default.move).message);
  t.throws(function () {
    subBoard._move(1, 1);
  }, (0, _error2.default)(_errors2.default.move, 1).message);
  t.throws(function () {
    subBoard._move(1, 'abc');
  }, (0, _error2.default)(_errors2.default.move, 'abc').message);
  t.throws(function () {
    subBoard._move(1, []);
  }, (0, _error2.default)(_errors2.default.move, []).message);
  t.throws(function () {
    subBoard._move(1, [1]);
  }, (0, _error2.default)(_errors2.default.move, [1]).message);
  t.throws(function () {
    subBoard._move(1, [1, 4]);
  }, (0, _error2.default)(_errors2.default.move, [1, 4]).message);
  t.throws(function () {
    subBoard._move(1, [-1, 4]);
  }, (0, _error2.default)(_errors2.default.move, [-1, 4]).message);
  t.throws(function () {
    subBoard._move(1, [1, 1, 1]);
  }, (0, _error2.default)(_errors2.default.move, [1, 1, 1]).message);
});

(0, _ava2.default)('Move rejects repeated moves', function (t) {
  var subBoard = new _SubBoard2.default();

  t.notThrows(function () {
    subBoard.addMyMove([1, 1]);
  });
  t.throws(function () {
    subBoard.addOpponentMove([1, 1]);
  }, (0, _error2.default)(_errors2.default.move, [1, 1]).message);
});

(0, _ava2.default)('Move rejects moves after board is full', function (t) {
  var subBoard = new _SubBoard2.default();

  t.notThrows(function () {
    subBoard = subBoard.addMyMove([0, 0]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addOpponentMove([0, 1]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addMyMove([0, 2]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addOpponentMove([1, 0]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addMyMove([2, 0]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addOpponentMove([1, 1]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addMyMove([1, 2]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addOpponentMove([2, 2]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addMyMove([2, 1]);
  });

  t.true(subBoard.isFinished());

  t.throws(function () {
    subBoard.addOpponentMove([1, 1]);
  }, (0, _error2.default)(_errors2.default.boardFinished).message);
});

(0, _ava2.default)('Can pretty print a board', function (t) {
  var subBoard = new _SubBoard2.default();

  t.notThrows(function () {
    subBoard.prettyPrint();
    t.is(_typeof(subBoard.prettyPrint()), 'string');
  });
});

(0, _ava2.default)('Detect winning row', function (t) {
  var subBoard = new _SubBoard2.default();

  t.notThrows(function () {
    subBoard = subBoard.addMyMove([0, 0]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addOpponentMove([1, 1]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addMyMove([0, 2]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addOpponentMove([1, 0]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addMyMove([0, 1]);
  });

  t.true(subBoard.isFinished());
  t.is(subBoard.getResult(), _SubBoard.ME);
});

(0, _ava2.default)('Detect winning column', function (t) {
  var subBoard = new _SubBoard2.default();

  t.notThrows(function () {
    subBoard = subBoard.addMyMove([0, 0]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addOpponentMove([1, 1]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addMyMove([2, 0]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addOpponentMove([0, 1]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addMyMove([1, 0]);
  });

  t.true(subBoard.isFinished());
  t.is(subBoard.getResult(), _SubBoard.ME);
});

(0, _ava2.default)('Detect winning RtL diagonal', function (t) {
  var subBoard = new _SubBoard2.default();

  t.notThrows(function () {
    subBoard = subBoard.addMyMove([0, 0]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addOpponentMove([2, 1]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addMyMove([1, 1]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addOpponentMove([2, 0]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addMyMove([2, 2]);
  });

  t.true(subBoard.isFinished());
  t.is(subBoard.getResult(), _SubBoard.ME);
});

(0, _ava2.default)('Detect winning LtR diagonal', function (t) {
  var subBoard = new _SubBoard2.default();

  t.notThrows(function () {
    subBoard = subBoard.addMyMove([2, 0]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addOpponentMove([2, 1]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addMyMove([1, 1]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addOpponentMove([1, 0]);
  });
  t.notThrows(function () {
    subBoard = subBoard.addMyMove([0, 2]);
  });

  t.true(subBoard.isFinished());
  t.is(subBoard.getResult(), _SubBoard.ME);
});
//# sourceMappingURL=SubBoard.test.js.map
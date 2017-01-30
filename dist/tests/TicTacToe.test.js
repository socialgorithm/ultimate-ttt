'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _TicTacToe = require('../model/TicTacToe');

var _TicTacToe2 = _interopRequireDefault(_TicTacToe);

var _errors = require('../errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validateBoard(board, t) {
  t.true(Array.isArray(board));

  board.forEach(row => {
    t.true(Array.isArray(row));
    row.forEach(cell => {
      t.true(cell >= 0);
      t.true(cell <= 2);
    });
  });
}

(0, _ava2.default)('Returns a valid TicTacToe model', t => {
  const tic = new _TicTacToe2.default();

  t.is(typeof tic, 'object');
  t.is(typeof tic.move, 'function');
  validateBoard(tic.board, t);
});

(0, _ava2.default)('Move correctly updates the board', t => {
  const tic = new _TicTacToe2.default();

  tic.move(1, [0, 0]);
  tic.move(2, [2, 1]);

  t.deepEqual(tic.board, [[1, 0, 0], [0, 0, 0], [0, 2, 0]]);
});

(0, _ava2.default)('Move rejects invalid player', t => {
  const tic = new _TicTacToe2.default();

  t.throws(() => {
    tic.move(-1, 1);
  }, _errors2.default.player);
  t.throws(() => {
    tic.move('abc', 1);
  }, _errors2.default.player);
  t.throws(() => {
    tic.move(0, 1);
  }, _errors2.default.player);
  t.throws(() => {
    tic.move(3, 1);
  }, _errors2.default.player);
});

(0, _ava2.default)('Move rejects invalid moves', t => {
  const tic = new _TicTacToe2.default();

  t.throws(() => {
    tic.move(1);
  }, _errors2.default.move);
  t.throws(() => {
    tic.move(1, 1);
  }, _errors2.default.move);
  t.throws(() => {
    tic.move(1, 'abc');
  }, _errors2.default.move);
  t.throws(() => {
    tic.move(1, []);
  }, _errors2.default.move);
  t.throws(() => {
    tic.move(1, [1]);
  }, _errors2.default.move);
  t.throws(() => {
    tic.move(1, [1, 4]);
  }, _errors2.default.move);
  t.throws(() => {
    tic.move(1, [-1, 4]);
  }, _errors2.default.move);
  t.throws(() => {
    tic.move(1, [1, 1, 1]);
  }, _errors2.default.move);
});

(0, _ava2.default)('Move rejects repeated moves', t => {
  const tic = new _TicTacToe2.default();

  t.notThrows(() => {
    tic.move(1, [1, 1]);
  });
  t.throws(() => {
    tic.move(1, [1, 1]);
  }, _errors2.default.repeat);
});

(0, _ava2.default)('Move rejects moves after finishing the game', t => {
  const tic = new _TicTacToe2.default();

  t.notThrows(() => {
    tic.move(1, [0, 0]);
  });
  t.notThrows(() => {
    tic.move(2, [0, 1]);
  });
  t.notThrows(() => {
    tic.move(1, [0, 2]);
  });
  t.notThrows(() => {
    tic.move(2, [1, 0]);
  });
  t.notThrows(() => {
    tic.move(2, [1, 1]);
  });
  t.notThrows(() => {
    tic.move(1, [1, 2]);
  });
  t.notThrows(() => {
    tic.move(1, [2, 0]);
  });
  t.notThrows(() => {
    tic.move(1, [2, 1]);
  });
  t.notThrows(() => {
    tic.move(2, [2, 2]);
  });

  t.throws(() => {
    tic.move(2, [1, 1]);
  }, _errors2.default.boardFinished);
});

(0, _ava2.default)('Can pretty print a board', t => {
  const tic = new _TicTacToe2.default();

  t.notThrows(() => {
    tic.prettyPrint();
  });
});

(0, _ava2.default)('Detect winning row', t => {
  const tic = new _TicTacToe2.default();

  t.notThrows(() => {
    tic.move(1, [0, 0]);
  });
  t.notThrows(() => {
    tic.move(2, [1, 1]);
  });
  t.notThrows(() => {
    tic.move(1, [0, 2]);
  });
  t.notThrows(() => {
    tic.move(2, [1, 0]);
  });
  t.notThrows(() => {
    tic.move(1, [0, 1]);
  });

  t.is(tic.winner, 1);
});

(0, _ava2.default)('Detect winning column', t => {
  const tic = new _TicTacToe2.default();

  t.notThrows(() => {
    tic.move(1, [0, 0]);
  });
  t.notThrows(() => {
    tic.move(2, [1, 1]);
  });
  t.notThrows(() => {
    tic.move(1, [2, 0]);
  });
  t.notThrows(() => {
    tic.move(2, [0, 1]);
  });
  t.notThrows(() => {
    tic.move(1, [1, 0]);
  });

  t.is(tic.winner, 1);
});

(0, _ava2.default)('Detect winning RtL diagonal', t => {
  const tic = new _TicTacToe2.default();

  t.notThrows(() => {
    tic.move(1, [0, 0]);
  });
  t.notThrows(() => {
    tic.move(2, [2, 1]);
  });
  t.notThrows(() => {
    tic.move(1, [1, 1]);
  });
  t.notThrows(() => {
    tic.move(2, [2, 0]);
  });
  t.notThrows(() => {
    tic.move(1, [2, 2]);
  });

  t.is(tic.winner, 1);
});

(0, _ava2.default)('Detect winning LtR diagonal', t => {
  const tic = new _TicTacToe2.default();

  t.notThrows(() => {
    tic.move(1, [2, 0]);
  });
  t.notThrows(() => {
    tic.move(2, [2, 1]);
  });
  t.notThrows(() => {
    tic.move(1, [1, 1]);
  });
  t.notThrows(() => {
    tic.move(2, [1, 0]);
  });
  t.notThrows(() => {
    tic.move(1, [0, 2]);
  });

  t.is(tic.winner, 1);
});
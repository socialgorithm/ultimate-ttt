import test from 'ava';

import TicTacToe from '../model/TicTacToe';

const errors = {
  player: 'Invalid player',
  move: 'Invalid move coordinates',
  repeat: 'Position already played',
  finished: 'Board already finished'
};

function validateBoard(board, t){
  t.true(Array.isArray(board));

  board.forEach((row) => {
    t.true(Array.isArray(row));
    row.forEach((cell) => {
      t.true(cell >= 0);
      t.true(cell <= 2);
    });
  });
}

test('Returns a valid TicTacToe model', t => {
  const tic = new TicTacToe();

  t.is(typeof(tic), 'object');
  t.is(typeof(tic.move), 'function');
  validateBoard(tic.getBoard(), t);
});

test('Move correctly updates the board', t => {
  const tic = new TicTacToe();

  tic.move(1, [0, 0]);
  tic.move(2, [2, 1]);

  t.deepEqual(tic.board, [
    [1, 0, 0],
    [0, 0, 0],
    [0, 2, 0]
  ]);
});

test('Move rejects invalid player', t => {
  const tic = new TicTacToe();

  t.throws(() => {tic.move(-1, 1)}, errors.player);
  t.throws(() => {tic.move('abc', 1)}, errors.player);
  t.throws(() => {tic.move(0, 1)}, errors.player);
  t.throws(() => {tic.move(3, 1)}, errors.player);
});

test('Move rejects invalid moves', t => {
  const tic = new TicTacToe();

  t.throws(() => {tic.move(1)}, errors.move);
  t.throws(() => {tic.move(1, 1)}, errors.move);
  t.throws(() => {tic.move(1, 'abc')}, errors.move);
  t.throws(() => {tic.move(1, [])}, errors.move);
  t.throws(() => {tic.move(1, [1])}, errors.move);
  t.throws(() => {tic.move(1, [1, 4])}, errors.move);
  t.throws(() => {tic.move(1, [-1, 4])}, errors.move);
  t.throws(() => {tic.move(1, [1, 1, 1])}, errors.move);
});

test('Move rejects repeated moves', t => {
  const tic = new TicTacToe();

  t.notThrows(() => {tic.move(1, [1, 1])});
  t.throws(() => {tic.move(1, [1, 1])}, errors.repeat);
});

test('Move rejects moves after finishing the game', t => {
  const tic = new TicTacToe();

  t.notThrows(() => {tic.move(1, [0, 0])});
  t.notThrows(() => {tic.move(2, [0, 1])});
  t.notThrows(() => {tic.move(1, [0, 2])});
  t.notThrows(() => {tic.move(2, [1, 0])});
  t.notThrows(() => {tic.move(2, [1, 1])});
  t.notThrows(() => {tic.move(1, [1, 2])});
  t.notThrows(() => {tic.move(1, [2, 0])});
  t.notThrows(() => {tic.move(1, [2, 1])});
  t.notThrows(() => {tic.move(2, [2, 2])});

  t.throws(() => {tic.move(2, [1, 1])}, errors.finished);
});

test('Can pretty print a board', t => {
  const tic = new TicTacToe();

  t.notThrows(() => {
    tic.prettyPrint();
  });
});

test('Detect winning row', t => {
  const tic = new TicTacToe();

  t.notThrows(() => {tic.move(1, [0, 0])});
  t.notThrows(() => {tic.move(2, [1, 1])});
  t.notThrows(() => {tic.move(1, [0, 2])});
  t.notThrows(() => {tic.move(2, [1, 0])});
  t.notThrows(() => {tic.move(1, [0, 1])});

  t.is(tic.winner, 1);
});

test('Detect winning column', t => {
  const tic = new TicTacToe();

  t.notThrows(() => {tic.move(1, [0, 0])});
  t.notThrows(() => {tic.move(2, [1, 1])});
  t.notThrows(() => {tic.move(1, [2, 0])});
  t.notThrows(() => {tic.move(2, [0, 1])});
  t.notThrows(() => {tic.move(1, [1, 0])});

  t.is(tic.winner, 1);
});

test('Detect winning RtL diagonal', t => {
  const tic = new TicTacToe();

  t.notThrows(() => {tic.move(1, [0, 0])});
  t.notThrows(() => {tic.move(2, [2, 1])});
  t.notThrows(() => {tic.move(1, [1, 1])});
  t.notThrows(() => {tic.move(2, [2, 0])});
  t.notThrows(() => {tic.move(1, [2, 2])});

  t.is(tic.winner, 1);
});

test('Detect winning LtR diagonal', t => {
  const tic = new TicTacToe();

  t.notThrows(() => {tic.move(1, [2, 0])});
  t.notThrows(() => {tic.move(2, [2, 1])});
  t.notThrows(() => {tic.move(1, [1, 1])});
  t.notThrows(() => {tic.move(2, [1, 0])});
  t.notThrows(() => {tic.move(1, [0, 2])});

  t.is(tic.winner, 1);
});
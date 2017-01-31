import test from 'ava';

import TicTacToe from '../model/TicTacToe';
import errors from '../model/errors';
import error from '../error';

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
  validateBoard(tic.board, t);
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

  t.throws(() => {tic.move(-1, 1)}, error(errors.player, '-1').message);
  t.throws(() => {tic.move('abc', 1)}, error(errors.player, 'abc').message);
  t.throws(() => {tic.move(0, 1)}, error(errors.player, '0').message);
  t.throws(() => {tic.move(3, 1)}, error(errors.player, '3').message);
});

test('Move rejects invalid moves', t => {
  const tic = new TicTacToe();

  t.throws(() => {tic.move(1)}, error(errors.move).message);
  t.throws(() => {tic.move(1, 1)}, error(errors.move, 1).message);
  t.throws(() => {tic.move(1, 'abc')}, error(errors.move, 'abc').message);
  t.throws(() => {tic.move(1, [])}, error(errors.move, []).message);
  t.throws(() => {tic.move(1, [1])}, error(errors.move, [1]).message);
  t.throws(() => {tic.move(1, [1, 4])}, error(errors.move, [1, 4]).message);
  t.throws(() => {tic.move(1, [-1, 4])}, error(errors.move, [-1, 4]).message);
  t.throws(() => {tic.move(1, [1, 1, 1])}, error(errors.move, [1, 1, 1]).message);
});

test('Move rejects repeated moves', t => {
  const tic = new TicTacToe();

  t.notThrows(() => {tic.move(1, [1, 1])});
  t.throws(() => {tic.move(1, [1, 1])}, error(errors.repeat, [1, 1]).message);
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

  t.throws(() => {tic.move(2, [1, 1])}, error(errors.boardFinished).message);
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
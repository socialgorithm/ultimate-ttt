import test from 'ava';

import UTTT from '../UTTT';
import errors from '../errors';

function validateBoard(board, t){
  t.true(Array.isArray(board));

  board.forEach((row) => {
    t.true(Array.isArray(row));
    row.forEach((cell) => {
      t.is(cell.winner, -1);
    });
  });
}

test('Returns a valid UTTT model', t => {
  const tic = new UTTT();

  t.is(typeof(tic), 'object');
  t.is(typeof(tic.move), 'function');
  validateBoard(tic.board, t);
});

test('Move correctly updates the board', t => {
  const tic = new UTTT();

  tic.move([1, 0], 1, [0, 0]);
  tic.move([0, 0], 2, [2, 1]);

  t.is(tic.board[1][0].board[0][0], 1);
  t.is(tic.board[0][0].board[2][1], 2);
});

test('Move rejects moves to the wrong board', t => {
  const tic = new UTTT();

  tic.move([1, 0], 1, [0, 0]);

  t.throws(() => {
    tic.move([2, 0], 2, [2, 1])
  }, errors.board);
});

test('Detect game ending', t => {
  const tic = new UTTT();

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
  }, errors.gameFinished);

  t.notThrows(() => {
    tic.prettyPrint();
  });

  t.is(tic.winner, 1);
});

test('Move allows playing on already won boards', t => {
  const tic = new UTTT();

  // Win [0, 0]
  tic.move([0, 0], 1, [0, 0]);
  tic.move([0, 0], 1, [1, 0]);
  tic.move([1, 0], 1, [0, 0]);
  tic.move([0, 0], 1, [2, 0]);
  tic.move([2, 0], 1, [0, 0]);

  t.notThrows(() => {
    tic.move([0, 0], 1, [1, 1]);
  });

  t.notThrows(() => {
    tic.prettyPrint();
  });
});

test('Move allows any board after being sent to one that is won', t => {
  const tic = new UTTT();

  // Fill [0, 0]
  tic.move([0, 0], 1, [0, 0]);
  tic.move([0, 0], 1, [1, 0]);
  tic.move([1, 0], 1, [0, 0]);
  tic.move([0, 0], 1, [2, 0]);

  t.notThrows(() => {
    tic.move([2, 0], 1, [0, 0]);
  });
});
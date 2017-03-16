import test from 'ava';

import UTTT from '../UTTT';
import errors from '../model/errors';
import { ME, OPPONENT, RESULT_TIE, RESULT_WIN, RESULT_LOSE } from '../model/SubBoard';
import error from '../error';

function validateBoard(board, t){
  t.true(Array.isArray(board));

  board.forEach((row) => {
    t.true(Array.isArray(row));
    row.forEach((cell) => {
      t.is(cell.winner, RESULT_TIE - 1);
    });
  });
}

test('Returns a valid UTTT model', t => {
  const game = new UTTT();

  t.is(typeof(game), 'object');
  t.is(typeof(game.isFinished), 'function');
  t.is(typeof(game.getResult), 'function');
  t.is(typeof(game.isValidMove), 'function');
  t.is(typeof(game.addMyMove), 'function');
  t.is(typeof(game.addOpponentMove), 'function');
  t.is(typeof(game.prettyPrint), 'function');

  validateBoard(game.board, t);
});

test('Moves correctly update the board', t => {
  let game = new UTTT();

  game = game.addMyMove([1, 0], [0, 0]);
  game = game.addOpponentMove([0, 0], [2, 1]);

  t.is(game.board[1][0].board[0][0].player, ME);
  t.is(game.board[0][0].board[2][1].player, OPPONENT);
});

test('Move rejects moves to the wrong board', t => {
  let game = new UTTT();

  game = game.addMyMove([1, 0], [0, 0]);

  t.throws(() => {
    game.addOpponentMove([2, 0], [2, 1])
  }, error(errors.board, [2, 0]).message);
});

test('Move rejects invalid moves', t => {
  let game = new UTTT();

  t.throws(() => {
    game.addMyMove([0, 0], [-1, 0])
  }, error(errors.move, [-1, 0]).message);

  t.throws(() => {
    game.addMyMove([-1, 0], [-1, 1])
  }, error(errors.board, [-1, 0]).message);
});

test('isValidMove returns false on invalid board/move', t => {
  let game = new UTTT();

  t.true(game.isValidMove([0, 0], [0, 0]));
  t.false(game.isValidMove([-1, 0], [0, 0]));
  t.false(game.isValidMove([1, 0], [-1, 0]));
});

test('_move fails on invalid player', t => {
  let game = new UTTT();

  t.throws(() => {
    game._move([0, 0], -1, [1, 0])
  }, error(errors.player, -1).message);
});

test('Detect game ending', t => {
  let game = new UTTT();

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

  t.throws(() => {
    game.addMyMove([0, 0], [1, 1]);
  }, error(errors.gameFinished).message);

  t.is(game.getResult(), ME);
});

test('Move doesn\'t allow playing on already won boards', t => {
  let game = new UTTT();

  // Win [0, 0]
  game = game.addMyMove([0, 0], [0, 0]);
  game = game.addMyMove([0, 0], [1, 0]);
  game = game.addMyMove([1, 0], [0, 0]);
  game = game.addMyMove([0, 0], [2, 0]);
  game = game.addMyMove([2, 0], [0, 0]);

  t.false(game.isFinished());

  t.throws(() => {
    game.addMyMove([0, 0], [1, 1]);
  }, error(errors.boardFinished).message);
});

test('Move allows any board after being sent to one that is won', t => {
  let game = new UTTT();

  // Fill [0, 0]
  game = game.addMyMove([0, 0], [0, 0]);
  game = game.addMyMove([0, 0], [1, 0]);
  game = game.addMyMove([1, 0], [0, 0]);
  game = game.addMyMove([0, 0], [2, 0]);

  t.notThrows(() => {
    game.addMyMove([2, 0], [0, 0]);
  });
});

test('A tie in a board works properly', t => {
  let game = new UTTT();

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

  t.notThrows(() => {
    game.prettyPrint();
  });
});
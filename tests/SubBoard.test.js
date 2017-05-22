import test from 'ava';

import SubBoard from '../dist/model/SubBoard';
import Cell from '../dist/model/Cell';
import { ME, OPPONENT } from '../dist/model/SubBoard';
import errors from '../dist/model/errors';
import error from '../dist/error';

function validateBoard(board, t){
  t.true(Array.isArray(board));

  board.forEach((row) => {
    t.true(Array.isArray(row));
    row.forEach((cell) => {
      t.true(cell.player >= -1);
      t.true(cell.player <= 2);
      t.true(cell.subBoardIndex >= -1);
      t.true(cell.mainIndex >= -1);
    });
  });
}

test('Returns a valid SubBoard model', t => {
  const subBoard = new SubBoard();

  t.is(typeof(subBoard), 'object');
  t.is(typeof(subBoard.isFinished), 'function');
  t.is(typeof(subBoard.getResult), 'function');
  t.is(typeof(subBoard.isValidMove), 'function');
  t.is(typeof(subBoard.addMyMove), 'function');
  t.is(typeof(subBoard.addOpponentMove), 'function');
  t.is(typeof(subBoard.prettyPrint), 'function');

  validateBoard(subBoard.board, t);
});

test('getResult fails if unfinished', t => {
  const subBoard = new SubBoard();

  t.throws(() => {
    subBoard.getResult()
  }, error(errors.gameNotFinished).message);
});

test('Move correctly updates the board', t => {
  let subBoard = new SubBoard();
  subBoard = subBoard.addMyMove([0, 0]);
  subBoard = subBoard.addOpponentMove([2, 1]);

  const emptyCell = new Cell();
  const myCell = new Cell(ME, 0);
  const opponentCell = new Cell(OPPONENT, 1);

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

test('Move rejects invalid player', t => {
  const subBoard = new SubBoard();

  t.throws(() => {subBoard.move(-1, 1)}, error(errors.player, '-1').message);
  t.throws(() => {subBoard.move('abc', 1)}, error(errors.player, 'abc').message);
  t.throws(() => {subBoard.move(3, 1)}, error(errors.player, '3').message);
});

test('Move rejects invalid moves', t => {
  const subBoard = new SubBoard();

  t.throws(() => {subBoard.move(1)}, error(errors.move).message);
  t.throws(() => {subBoard.move(1, 1)}, error(errors.move, 1).message);
  t.throws(() => {subBoard.move(1, 'abc')}, error(errors.move, 'abc').message);
  t.throws(() => {subBoard.move(1, [])}, error(errors.move, []).message);
  t.throws(() => {subBoard.move(1, [1])}, error(errors.move, [1]).message);
  t.throws(() => {subBoard.move(1, [1, 4])}, error(errors.move, [1, 4]).message);
  t.throws(() => {subBoard.move(1, [-1, 4])}, error(errors.move, [-1, 4]).message);
  t.throws(() => {subBoard.move(1, [1, 1, 1])}, error(errors.move, [1, 1, 1]).message);
});

test('Move rejects repeated moves', t => {
  const subBoard = new SubBoard();

  t.notThrows(() => {subBoard.addMyMove([1, 1])});
  t.throws(() => {subBoard.addOpponentMove([1, 1])}, error(errors.move, [1, 1]).message);
});

test('Move rejects moves after board is full', t => {
  let subBoard = new SubBoard();

  t.notThrows(() => {subBoard = subBoard.addMyMove([0, 0])});
  t.notThrows(() => {subBoard = subBoard.addOpponentMove([0, 1])});
  t.notThrows(() => {subBoard = subBoard.addMyMove([0, 2])});
  t.notThrows(() => {subBoard = subBoard.addOpponentMove([1, 0])});
  t.notThrows(() => {subBoard = subBoard.addMyMove([2, 0])});
  t.notThrows(() => {subBoard = subBoard.addOpponentMove([1, 1])});
  t.notThrows(() => {subBoard = subBoard.addMyMove([1, 2])});
  t.notThrows(() => {subBoard = subBoard.addOpponentMove([2, 2])});
  t.notThrows(() => {subBoard = subBoard.addMyMove([2, 1])});

  t.true(subBoard.isFinished());

  t.throws(() => {subBoard.addOpponentMove([1, 1])}, error(errors.boardFinished).message);
});

test('Can pretty print a board', t => {
  const subBoard = new SubBoard();

  t.notThrows(() => {
    subBoard.prettyPrint();
    t.is(typeof subBoard.prettyPrint(), 'string');
  });
});

test('Detect winning row', t => {
  let subBoard = new SubBoard();

  t.notThrows(() => {subBoard = subBoard.addMyMove([0, 0])});
  t.notThrows(() => {subBoard = subBoard.addOpponentMove([1, 1])});
  t.notThrows(() => {subBoard = subBoard.addMyMove([0, 2])});
  t.notThrows(() => {subBoard = subBoard.addOpponentMove([1, 0])});
  t.notThrows(() => {subBoard = subBoard.addMyMove([0, 1])});

  t.true(subBoard.isFinished());
  t.is(subBoard.getResult(), ME);
});

test('Detect winning column', t => {
  let subBoard = new SubBoard();

  t.notThrows(() => {subBoard = subBoard.addMyMove([0, 0])});
  t.notThrows(() => {subBoard = subBoard.addOpponentMove([1, 1])});
  t.notThrows(() => {subBoard = subBoard.addMyMove([2, 0])});
  t.notThrows(() => {subBoard = subBoard.addOpponentMove([0, 1])});
  t.notThrows(() => {subBoard = subBoard.addMyMove([1, 0])});

  t.true(subBoard.isFinished());
  t.is(subBoard.getResult(), ME);
});

test('Detect winning RtL diagonal', t => {
  let subBoard = new SubBoard();

  t.notThrows(() => {subBoard = subBoard.addMyMove([0, 0])});
  t.notThrows(() => {subBoard = subBoard.addOpponentMove([2, 1])});
  t.notThrows(() => {subBoard = subBoard.addMyMove([1, 1])});
  t.notThrows(() => {subBoard = subBoard.addOpponentMove([2, 0])});
  t.notThrows(() => {subBoard = subBoard.addMyMove([2, 2])});

  t.true(subBoard.isFinished());
  t.is(subBoard.getResult(), ME);
});

test('Detect winning LtR diagonal', t => {
  let subBoard = new SubBoard();

  t.notThrows(() => {subBoard = subBoard.addMyMove([2, 0])});
  t.notThrows(() => {subBoard = subBoard.addOpponentMove([2, 1])});
  t.notThrows(() => {subBoard = subBoard.addMyMove([1, 1])});
  t.notThrows(() => {subBoard = subBoard.addOpponentMove([1, 0])});
  t.notThrows(() => {subBoard = subBoard.addMyMove([0, 2])});

  t.true(subBoard.isFinished());
  t.is(subBoard.getResult(), ME);
});
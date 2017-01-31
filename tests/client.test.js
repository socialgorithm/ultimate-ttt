import test from 'ava';

import Client from '../sample/random';

const player = 1;
const invalidPlayer = 'Invalid player';

test('Validates player', t => {
  t.throws(() => {
    new Client();
  }, invalidPlayer);

  t.throws(() => {
    new Client(-1);
  }, invalidPlayer);

  t.throws(() => {
    new Client(0);
  }, invalidPlayer);

  t.throws(() => {
    new Client(3);
  }, invalidPlayer);

  t.throws(() => {
    new Client('a');
  }, invalidPlayer);
});

test('Contains valid getMove method', t => {
  const tic = new Client(player);

  t.is(typeof(tic), 'object');
  t.is(typeof(tic.getMove), 'function');

  const move = tic.getMove();

  t.is(move.board.length, 2);
  t.is(move.move.length, 2);
});

test('Contains valid addMove method', t => {
  const tic = new Client(player);

  t.is(typeof(tic), 'object');
  t.is(typeof(tic.addMove), 'function');

  let move = tic.getMove();
  tic.addMove(move.board, move.move);
  t.is(tic.game.nextBoard, move.move);

  move = tic.getMove();
  tic.addMove(move.board, move.move);
  t.is(tic.game.nextBoard, move.move);
});

test('Contains valid addOpponentMove method', t => {
  const tic = new Client(player);

  t.is(typeof(tic), 'object');
  t.is(typeof(tic.addOpponentMove), 'function');

  let move = tic.getMove();
  tic.addOpponentMove(move.board, move.move);
  t.is(tic.game.nextBoard, move.move);

  move = tic.getMove();
  tic.addMove(move.board, move.move);
  t.is(tic.game.nextBoard, move.move);
});

test('Selects the right board if the next one is full', t => {
  const tic = new Client(player);

  tic.game.board[0][0].board = [
    [1, 2, 1],
    [1, 2, 1],
    [2, 1, 2]
  ];
  tic.game.board[0][0].moves = 9;
  tic.game.board[0][0].winner = 0;

  let move = tic.getMove();
  t.is(move.board.length, 2);
  t.is(move.move.length, 2);
});
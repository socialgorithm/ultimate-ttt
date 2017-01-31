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

test('Contains getMove method', t => {
  const tic = new Client(player);

  t.is(typeof(tic), 'object');
  t.is(typeof(tic.getMove), 'function');

  const move = tic.getMove();

  t.is(move.board.length, 2);
  t.is(move.move.length, 2);
});
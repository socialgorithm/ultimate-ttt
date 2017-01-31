import test from 'ava';

import Client from '../sample/random';

test('Contains move method', t => {
  const tic = new Client();

  t.is(typeof(tic), 'object');
  t.is(typeof(tic.move), 'function');

  const move = tic.move();

  t.is(move.board.length, 2);
  t.is(move.move.length, 2);
});